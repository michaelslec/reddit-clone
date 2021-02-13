import { Post } from "../entities/Post";
import { Ctx, Query, Resolver } from "type-graphql";
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Ctx()
    {
      em,
    }: {
      em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    }
  ): Promise<Post[]> {
    return em.find(Post, {});
  }
}
