import { env } from './src/config/env.js';
import app from './src/app.js';

const server = app.listen(env.port, () => {
  console.log(`RimTech API running on http://localhost:${env.port} (${env.nodeEnv})`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${env.port} is already in use. Stop the other process or change PORT in .env.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
