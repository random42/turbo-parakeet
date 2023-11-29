import assert from 'node:assert/strict';
import createApp from '../src/app';
import { test } from 'node:test';
// import { nanoid } from 'nanoid';

test('main', async (t) => {
  const { nanoid } = await import('nanoid');
  const app = await createApp();
  await t.test('get', async (t) => {
    const id = nanoid();
    const res = await app.inject().post('/safe-data/get').body({
      id,
      decryption_key: 'asd',
    });
    assert.deepEqual(res.body, { id });
  });
});
