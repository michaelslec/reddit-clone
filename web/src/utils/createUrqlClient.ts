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
} from "../generated/graphql";

import { betterUpdateQuery } from "./betterUpdateQuery";

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

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:3001/graphql",
  fetchOptions: {
    credentials: "include" as const,
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
          vote: (_result, args, cache) => {
            const { postId, value } = args as VoteMutationVariables;
            const data = cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  points
                }
              `,
              { id: postId }
            );

            if (data) {
              const newPoints = data.points + value;
              cache.writeFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                  }
                `,
                { id: postId, points: newPoints }
              );
            }
          },
          createPost: (_result, _args, cache) => {
            const allFields = cache.inspectFields("Query");
            const fieldInfos = allFields.filter(
              (info) => info.fieldName === "posts"
            );

            fieldInfos.forEach((fi) => {
              cache.invalidate("Query", "posts", fi.arguments || {});
            });
          },
          logout: (_result, _args, cache) => {
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
});
