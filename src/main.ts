import 'dotenv/config';
import createApp from './app';

async function main() {
  const app = await createApp();
  const { log } = app;
  await app.listen({
    port: 3000,
  });
  log.info(`Swagger at: http://localhost:3000/api`);
}

main().catch(console.log);
