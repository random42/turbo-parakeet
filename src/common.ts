import type app from './app';

export type Application = Awaited<ReturnType<typeof app>>;
