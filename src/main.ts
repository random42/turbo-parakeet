import createApp from './app';
import loadConfig from './config';

async function main() {
  const config = await loadConfig();
  const { port } = config;
  const app = await createApp(config);
  const { log } = app;
  await app.listen({
    port,
  });
  // log.info(`Server listening at: ${port}`);
}

main().catch(console.log);
