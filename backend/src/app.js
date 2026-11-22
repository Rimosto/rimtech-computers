import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();

// On Render the app sits behind a proxy, so trust it to report the real visitor IP.
if (env.isProduction) app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  })
);
app.use(express.json({ limit: '100kb' }));

app.use('/api', apiLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
