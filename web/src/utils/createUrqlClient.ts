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
} from "urql";
import { pipe, tap } from "wonka";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
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
    console.log("fieldInfos:", fieldInfos);
    if (fieldInfos.length === 0) return undefined;

    const key = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    info.partial = !cache.resolve(entityKey, key);

    let results: string[] = [];
    fieldInfos.forEach((fi) => {
      const data = cache.resolve(entityKey, fi.fieldKey) as string[];
      results.push(...data);
    });

    return results;
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
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
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
