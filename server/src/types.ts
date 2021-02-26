import { Request, Response } from "express";
import { Redis } from "ioredis";
import createUpperLoader from "./utils/createUpperLoader";
import createUserLoader from "./utils/createUserLoader";

declare module "express-session" {
  interface Session {
    userId: number;
  }
}

export type MyCtx = {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  upperLoader: ReturnType<typeof createUpperLoader>;
};
