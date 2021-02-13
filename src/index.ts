import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";

async function main() {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
}

main();
