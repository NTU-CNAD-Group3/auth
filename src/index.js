import 'express-async-errors';

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

import config from '@/config.js';
import { databaseConnection } from '@/models/db.js';
import logger from '@/utils/logger.js';
import routes from '@/routes/index.js';

const app = express();

app.set('trust proxy', 1);

app.use(compression());
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(express.json({ limit: '200mb' }));
app.use(
  cors({
    origin: config.API_GATEWAY_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

app.use(hpp());
app.use(helmet());

// log incoming requests
app.use((req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode < 400) {
      logger.info({
        message: `msg=Received response method=${req.method} path=${req.route.path} ip=${req.ip} status=${res.statusCode} url=${req.originalUrl}`,
      });
    }
  });
  next();
});

app.use(`/api`, routes);

// route not found
app.use('*', (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
    logger.error({
      message: `msg=Error occured method=${req.method} path=${req.route.path} ip=${req.ip} status=${res.statusCode} url=${req.originalUrl} error=${err.message}`,
    });
  }
});

app.listen(config.PORT, async () => {
  await databaseConnection();
  logger.info({
    message: `msg=Server started at port ${config.PORT}`,
  });
});

export default app;
