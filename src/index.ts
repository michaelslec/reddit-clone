import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

async function main() {
  const orm = await MikroORM.init({
    entities: [Post],
    dbName: "reddit-clone",
    type: "postgresql",
    debug: !__prod__,
  });
}

main();
