import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  Float,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { MyCtx } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Upper } from "../entities/Upper";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver()
export class PostResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyCtx
  ) {
    const isUpper = value !== -1;
    const realValue = isUpper ? 1 : -1;
    const { userId } = req.session;

    const upper = await Upper.findOne({ where: { postId, userId } });
    if (upper && upper.value !== realValue)
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update upper
          set value = $1
          where "postId" = $2 and "userId" = $3
          `,
          [realValue, postId, userId]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
          `,
          [2 * realValue, postId]
        );
      });
    else if (!upper)
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          insert into upper("userId", "postId", value)
          values ($1,$2,$3);
          `,
          [userId, postId, realValue]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2;
          `,
          [realValue, postId]
        );
      });

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => Float, { nullable: true }) cursor: number | null,
    @Ctx() { req }: MyCtx
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    let replacements: any[] = [realLimitPlusOne];
    if (req.session.userId) replacements.push(req.session.userId);

    let cursorIdx = 3;
    if (cursor) {
      replacements.push(new Date(cursor));
      cursorIdx = replacements.length;
    }

    const posts = await getConnection().query(
      `
      select p.*, 
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email,
        'createdAt', u."createdAt",
        'updatedAt', u."updatedAt"
      ) creator,
      ${
        req.session.userId
          ? '(select value from upper where "userId" = $2 and "postId" = p.id) "voteStatus"'
          : 'null as "voteStatus"'
      }
      from post p 
      inner join public.user u on u.id = p."creatorId"
      ${cursor ? 'where p."createdAt" <= $' + cursorIdx : ""}
      order by p."createdAt" DESC
      limit $1
      `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyCtx
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string | undefined
  ): Promise<Post | null> {
    const post = await Post.findOne({ id });

    if (!post) return null;
    if (typeof title !== "undefined") await Post.update({ id }, { title });

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
