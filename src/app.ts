import { Config } from './config';
import fastify from 'fastify';

export default async (config: Config) => {
  const nanoid = await import('nanoid');
  const app = fastify({
    genReqId: () => nanoid.nanoid(),
    requestIdHeader: 'x-req-id',
    logger: {
      nestedKey: 'data',
    },
  });
  app.get('/', (req, res) => {
    res.send('Hello world!');
  });
  return app;
};
