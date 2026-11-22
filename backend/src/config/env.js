import dotenv from 'dotenv';

dotenv.config({ quiet: true });

function list(value, fallback) {
  return (value ?? fallback)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const nodeEnv = process.env.NODE_ENV || 'development';
const port = Number(process.env.PORT || 5000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a whole number between 1 and 65535');
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
  isTest: nodeEnv === 'test',
  port,
  clientOrigins: list(process.env.CLIENT_ORIGIN, 'http://localhost:5173'),
};
