import 'dotenv/config';

import express from 'express';
import path from 'path';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import io from 'socket.io';
import http from 'http';
import cors from 'cors';
import routes from './router';
// import sentryConfif from '../config/sentry';
import '../database';

class App {
  constructor() {
    this.server = express();

    // Sentry.init(sentryConfif);

    this.middlewares();
    this.routes();
    this.socketHandler();
    this.exceptionHandler();
  }

  socketHandler() {
    const server = http.Server(this.server);
    const socketIO = io.listen(server);
    server.listen(8080, '127.0.0.1');

    socketIO.on('connection', (socket) => {
      console.log('new connection', socket.id);
      socket.emit('notification', { hello: 'Gutin viadin' });
      socket.on('my other event', (data) => {
        console.log(data);
      });
    });

    this.server.use((req, res, next) => {
      req.io = socketIO;
      return next();
    });
  }

  middlewares() {
    this.server.use(helmet());
    this.server.use(
      cors({
        origin: process.env.FRONT_URL,
        credentials: true,
        optionsSuccessStatus: 204,
      }),
    );
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', '..', 'tmp', 'uploads')),
    );
    if (process.env.NODE_ENV !== 'development') {
      this.server.use(
        new RateLimit({
          store: new RateLimitRedis({
            client: redis.createClient({
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT,
            }),
          }),
          windowMs: 1000 * 60 * 15,
          max: 100,
        }),
      );
    }
  }

  routes() {
    this.server.use(routes);
    // this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
