import { MyCtx } from "../types/myctx";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyCtx> = ({ context }, next) => {
  if (!context.req.session.userId) throw new Error("Not Authenticated");

  return next();
};
