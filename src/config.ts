import { cleanEnv, num, url } from 'envalid';

export type Config = {
  port: number;
  databaseURL: string;
};

export default async (): Promise<Config> => {
  const env = cleanEnv(process.env, {
    PORT: num(),
    DATABASE_URL: url(),
  });
  return {
    port: env.PORT,
    databaseURL: env.DATABASE_URL,
  };
};
