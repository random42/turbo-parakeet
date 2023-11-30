import { SafeDataDto, id, key, schema, upsertSchema } from './dto';
import { Type } from '@sinclair/typebox';
import { Application } from '../common';
import _ from 'lodash';
import db from '../db';
import * as crypto from '../crypto';

export default (app: Application) => {
  /**
   * Upsert API
   */
  app.put(
    '/safe-data',
    {
      schema: {
        body: upsertSchema,
        response: {
          200: Type.String(),
        },
      },
    },
    async (req, res) => {
      const { body } = req;
      const { id, encryption_key: key } = body;
      const data = await crypto.encrypt(
        Buffer.from(JSON.stringify(body.value)),
        key,
      );
      await db.safeData.upsert({
        where: {
          id,
        },
        create: {
          id,
          data,
        },
        update: {
          data,
        },
      });
      res.send('OK');
    },
  );

  /**
   * Usually I would do GET /safe-data/:id
   * but since there is a key to be sent
   * I preferred putting the parameters in the body
   */
  app.post(
    '/safe-data/get',
    {
      schema: {
        body: Type.Object({
          id,
          decryption_key: key,
        }),
        response: {
          200: Type.Array(schema),
        },
      },
    },
    async (req, res) => {
      const { id, decryption_key: key } = req.body;
      let search = id;
      if (id.endsWith('*')) {
        search = id.slice(0, -1);
      }
      // fetch data
      // could be optimized by using equality in case wildcard is not present
      const items = await db.safeData.findMany({
        where: {
          id: {
            startsWith: search,
          },
        },
      });
      req.log.info({ id, items: items.length });
      // decrypt many items concurrently
      const data = await Promise.all(
        items.map(async (x) => {
          try {
            const decrypted = await crypto.decrypt(x.data, key);
            const value = JSON.parse(decrypted.toString());
            return {
              id: x.id,
              data: value,
              createdAt: x.createdAt.toISOString(),
              updatedAt: x.updatedAt.toISOString(),
            };
          } catch (err) {
            req.log.error(err, 'decrypt');
            return undefined;
          }
        }),
      );
      // filter out decryption errors (undefined values)
      const results = data.filter((x) => x) as SafeDataDto[];
      req.log.info({ id, results: results.length });
      res.send(results);
      // const data = await db.
    },
  );
};
