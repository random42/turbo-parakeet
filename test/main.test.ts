import assert from 'node:assert/strict';
import createApp from '../src/app';
import { test } from 'node:test';
import db from '../src/db';

test('main', async (t) => {
  const { nanoid } = await import('nanoid');
  const app = await createApp();
  // delete all records before each test
  t.beforeEach(() => db.safeData.deleteMany());
  t.after(() => db.safeData.deleteMany());

  await t.test('put and get', async (t) => {
    const id = nanoid();
    const key = nanoid();
    const value = {
      some: 'data',
    };
    const put = await app.inject().put('/safe-data').body({
      id,
      encryption_key: key,
      value,
    });
    assert.equal(put.statusCode, 200);
    const get = await app.inject().post('/safe-data/get').body({
      id,
      decryption_key: key,
    });
    const body = get.json();
    assert.equal(get.statusCode, 200);
    assert.equal(body.length, 1);
    assert.equal(body[0].id, id);
    assert.deepEqual(body[0].data, value);
  });

  await t.test('wildcard', async (t) => {
    const key = nanoid();
    const key1 = nanoid();
    const inputs = [
      {
        id: 'a1',
        key,
      },
      {
        id: 'a2',
        key,
      },
      {
        id: 'a3',
        key: key1,
      },
      {
        id: 'b1',
        key,
      },
    ];
    const value = {
      some: 'data',
      and: 1,
    };
    const upserts = await Promise.all(
      inputs.map(async (x) => {
        return app.inject().put('/safe-data').body({
          id: x.id,
          encryption_key: x.key,
          value,
        });
      }),
    );
    upserts.forEach((res) => {
      assert.equal(res.statusCode, 200);
    });
    // a3 has different key and should not be included
    const get1 = await app.inject().post('/safe-data/get').body({
      id: 'a*',
      decryption_key: key,
    });
    assert.equal(get1.json()?.length, 2);
    // will only include a3
    const get2 = await app.inject().post('/safe-data/get').body({
      id: 'a*',
      decryption_key: key1,
    });
    assert.equal(get2.json()?.length, 1);
    // will include
    const get3 = await app.inject().post('/safe-data/get').body({
      id: '*',
      decryption_key: key,
    });
    assert.equal(get3.json()?.length, 3);
  });
});
