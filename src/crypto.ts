import assert from 'node:assert';
import crypto from 'node:crypto';
import util from 'node:util';

const ALG = 'aes-256-gcm';
const KEY_LEN = 32;
const IV_LEN = 16;
const AUTH_TAG_LEN = 16;
const IV_POS = 0;
const AUTH_TAG_POS = IV_LEN;
const DATA_POS = IV_LEN + AUTH_TAG_LEN;

const { SALT } = process.env;

console.log({ KEY_LEN, IV_LEN });
assert(SALT);

const getKey = async (password: string) => {
  const scrypt = util.promisify(crypto.scrypt);
  const key = await scrypt(password, SALT, KEY_LEN);
  return key as Buffer;
};

export const encrypt = async (data: Buffer, password: string) => {
  const iv = crypto.randomBytes(IV_LEN);
  const key = await getKey(password);
  const cipher = crypto.createCipheriv(ALG, key, iv);
  const encData = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const result = Buffer.concat([iv, authTag, encData]);
  return result;
};

export const decrypt = async (data: Buffer, password: string) => {
  const key = await getKey(password);
  const iv = data.subarray(IV_POS, IV_LEN);
  const authTag = data.subarray(AUTH_TAG_POS, DATA_POS);
  const encData = data.subarray(DATA_POS);
  const decipher = crypto.createDecipheriv(ALG, key, iv);
  decipher.setAuthTag(authTag);
  const result = Buffer.concat([decipher.update(encData), decipher.final()]);
  return result;
};
