declare namespace NodeJS {
  export interface ProcessEnv {
    SESH_SECRET: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
  }
}
