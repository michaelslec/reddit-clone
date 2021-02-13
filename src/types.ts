import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type MyCtx = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
