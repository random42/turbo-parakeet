import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify, { FastifyHttpOptions } from 'fastify';
import safeData from './safe-data/routes';
import { features } from 'process';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

export default async () => {
  const nanoid = (await import('nanoid')).nanoid;
  const app = fastify({
    genReqId: () => nanoid(),
    requestIdHeader: 'x-req-id',
    logger: {
      nestedKey: 'data',
    },
  }).withTypeProvider<TypeBoxTypeProvider>();
  await app.register(swagger, {
    swagger: {
      host: 'localhost:3000',
    },
  });
  await app.register(swaggerUI, {
    routePrefix: 'api',
  });
  app.get('/', (req, res) => {
    res.send('OK');
  });
  safeData(app);
  await app.ready();
  return app;
};
