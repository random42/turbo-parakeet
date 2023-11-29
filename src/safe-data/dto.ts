import { Type, Static } from '@sinclair/typebox';

export const id = Type.String({
  // minLength: 10,
  // maxLength: 50,
});

export const key = Type.String({
  // minLength: 40,
  // maxLength: 100,
});

export const schema = Type.Object({
  id,
  data: Type.Any(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const upsertSchema = Type.Object({
  id,
  encryption_key: key,
  value: Type.Any(),
});

export type SafeDataDto = Static<typeof schema>;
export type UpsertSafeDataDto = Static<typeof upsertSchema>;
