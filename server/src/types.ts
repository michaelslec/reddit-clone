import DataLoader from "dataloader";
import { Request, Response } from "express";
import { Redis } from "ioredis";
import { User } from "./entities/User";

declare module "express-session" {
  interface Session {
    userId: number;
  }
}

export type MyCtx = {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: DataLoader<number, User, number>;
};
