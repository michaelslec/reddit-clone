import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
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

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx()
    {
      em,
    }: {
      em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    }
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }
}
