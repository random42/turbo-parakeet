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
  data: Type.Any(),
});

export type SafeData = Static<typeof schema>;
export type UpsertSafeData = Static<typeof upsertSchema>;
