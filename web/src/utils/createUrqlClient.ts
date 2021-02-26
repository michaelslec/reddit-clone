import {
  cacheExchange,
  Data,
  ResolveInfo,
  Resolver,
  Variables,
  Cache,
} from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  Exchange,
  dedupExchange,
  fetchExchange,
  stringifyVariables,
  gql,
} from "urql";
import { pipe, tap } from "wonka";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  DeletePostMutationVariables,
} from "../generated/graphql";

import { betterUpdateQuery } from "./betterUpdateQuery";
import isServer from "./isServer";

export const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // If the OperationResult has an error send a request to sentry
      if (error?.message.includes("Not Authenticated"))
        Router.replace("/login");
    })
  );
};

const cursorPagination = (): Resolver => {
  return (
    _parent: Data,
    fieldArgs: Variables,
    cache: Cache,
    info: ResolveInfo
  ) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    if (fieldInfos.length === 0) return undefined;

    const key = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    info.partial = !cache.resolve(
      cache.resolve(entityKey, key) as string,
      "posts"
    );

    let results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const dataNoRepeats = results.length === 0 ? data : data.slice(1);
      if (!cache.resolve(key, "hasMore")) hasMore = false;
      results.push(...dataNoRepeats);
    });

    return { __typename: "PaginatedPosts", posts: results, hasMore };
  };
};

function invalidateAllPosts(cache: Cache) {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");

  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "posts", fi.arguments || {});
  });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer() && ctx) cookie = ctx.req.headers.cookie;

  return {
    url: "http://localhost:3001/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache) => {
              cache.invalidate({
                __typename: "Post",
                id: (args as DeletePostMutationVariables).id,
              });
            },
            vote: (_result, args, cache) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId }
              );

              if (data) {
                if (data.voteStatus === args.value) return;
                const newPoints =
                  data.points + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value }
                );
              }
            },
            createPost: (_result, _args, cache) => {
              invalidateAllPosts(cache);
            },
            logout: (_result, _args, cache) => {
              invalidateAllPosts(cache);
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
            login: (_result, _args, cache) => {
              betterUpdateQuery(
                cache,
                { query: MeDocument },
                _result,
                (result: LoginMutation, query) => {
                  if (result.login.__typename === "FieldError") {
                    return query;
                  } else {
                    return {
                      me: result.login,
                    };
                  }
                }
              );
              invalidateAllPosts(cache);
            },
            register: (_result, _args, cache) => {
              betterUpdateQuery(
                cache,
                { query: MeDocument },
                _result,
                (result: RegisterMutation, query) => {
                  if (result.register.__typename === "FieldError") {
                    return query;
                  } else {
                    return {
                      me: result.register,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
