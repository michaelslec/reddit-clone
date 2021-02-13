import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { MyCtx } from "src/types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyCtx): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyCtx
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }
}
