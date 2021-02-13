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
  Resolver,
} from "type-graphql";

@InputType()
class UsernamePasswordInput {
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
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyCtx
  ): Promise<typeof UserResponse> {
    if (options.username.length <= 2)
      return new FieldError("username", "Length must be greater than 2");

    if (options.username.length <= 3)
      return new FieldError("password", "Length must be greater than 3");

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      // 23505 ==
      if (err.code == "23505")
        return new FieldError("username", "Username already exists");
      else
        return new FieldError(
          "Unkown",
          `Unkown error-server response: ${err.message}`
        );
    }

    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyCtx
  ): Promise<typeof UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) return new FieldError("username", "Username doesn't exist");

    const valid = await argon2.verify(user.password, options.password);
    if (!valid) return new FieldError("password", "Password is incorrect");

    return user;
  }
}
