import { id, key, schema, upsertSchema } from './dto';
import { Type } from '@sinclair/typebox';
import { Application } from '../common';
import _ from 'lodash';
import db from '../db';
import * as crypto from '../crypto';

export default (app: Application) => {
  /**
   * Usually I would GET /safe-data/:id
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
        // response: {
        //   200: schema,
        // },
      },
    },
    async (req, res) => {
      const { id, decryption_key } = req.body;
      req.log.info({ key });
      res.send({});
      // const data = await db.
    },
  );

  app.put(
    '/safe-data',
    {
      schema: {
        body: upsertSchema,
        // response: {
        //   200: schema,
        // },
      },
    },
    async (req, res) => {
      const { body } = req;
      const { id, encryption_key: key } = body;
      const data = Buffer.from(body.data, 'utf-8');
      const encData = await crypto.encrypt(data, key);
      // console.log({ encData });
      const result = await crypto.decrypt(encData, key);
      req.log.info({
        compare: data.compare(result),
      });
      res.send('ok');
      // const data = await db.
    },
  );
};
