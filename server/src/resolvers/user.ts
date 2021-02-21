import * as argon2 from "argon2";
import { User } from "../entities/User";
import { MyCtx } from "src/types";
import {
  Arg,
  createUnionType,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { COOKIE_NAME, FORET_PASSWORD_PREFIX } from "../constants";
import sendEmail from "../utils/sendEmail";
import { v4 } from "uuid";

@InputType()
class EmailUsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  constructor(field: string, message: string) {
    this.field = field;
    this.message = message;
  }

  @Field()
  field: string;

  @Field()
  message: string;
}

const UserResponse = createUnionType({
  name: "UserResponse",
  types: () => [FieldError, User],
});

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, em, req }: MyCtx
  ): Promise<typeof UserResponse> {
    if (newPassword.length <= 2)
      return new FieldError("newPassword", "Length must be greater than 2");

    const userId = await redis.get(FORET_PASSWORD_PREFIX + token);
    if (userId === null) return new FieldError("token", "Token expired");

    const user = await em.findOne(User, { id: parseInt(userId) });
    if (!user) return new FieldError("token", "User no longer exists");

    user.password = await argon2.hash(newPassword);
    await em.persistAndFlush(user);

    redis.del(FORGET_PASSWORD_PREFIX + token);

    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("input") input: EmailUsernamePasswordInput,
    @Ctx() { em, redis }: MyCtx
  ) {
    const where =
      input.email === ""
        ? { username: input.username }
        : { email: input.email };

    const user = await em.findOne(User, where);
    if (user === null) return true;

    const token = v4();
    await redis.set(
      FORET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24
    );

    await sendEmail(
      input.email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyCtx) {
    if (!req.session.userId) return null;

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: EmailUsernamePasswordInput,
    @Ctx() { em, req }: MyCtx
  ): Promise<typeof UserResponse> {
    if (!options.email?.includes("@"))
      return new FieldError("email", "Invalid email address");

    if (options.username.includes("@"))
      return new FieldError("username", "Cannot include '@'");

    if (options.username.length <= 2)
      return new FieldError("username", "Length must be greater than 2");

    if (options.password.length <= 3) {
      return new FieldError("password", "Length must be greater than 3");
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      email: options.email,
      username: options.username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      // TODO: watch here for error code on username AND/OR email already existing
      if (err.code == "23505" && err.detail.includes("email"))
        return new FieldError("email", "Email already exists");
      else if (err.code == "23505" && err.detail.includes("username"))
        return new FieldError("username", "Username already exists");
      else
        return new FieldError(
          "unkown",
          `Unkown error-server response: ${err.message}`
        );
    }

    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options")
    options: EmailUsernamePasswordInput,
    @Ctx() { em, req }: MyCtx
  ): Promise<typeof UserResponse> {
    const user = await em.findOne(
      User,
      options.email !== ""
        ? { email: options.email }
        : { username: options.username }
    );

    if (user === null)
      return new FieldError("username", "Username or email doesn't exist");

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) return new FieldError("password", "Password is incorrect");

    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyCtx) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) resolve(false);
        else resolve(true);
      })
    );
  }
}
