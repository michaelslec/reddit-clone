import { Cache, QueryInput } from "@urql/exchange-graphcache";

// TODO: study urql cache
export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  input: QueryInput,
  result: any,
  update: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(input, (data) => update(result, data as any) as any);
}
