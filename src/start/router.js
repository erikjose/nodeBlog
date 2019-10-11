import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multer from 'multer';
import multerConfig from '../config/multer';

import UserController from '../app/controllers/UserController';
import SessionController from '../app/controllers/SessionController';
import FileController from '../app/controllers/FileController';
import PostController from '../app/controllers/PostController';
import CommentController from '../app/controllers/CommentController';
import LikeController from '../app/controllers/LikeController';
import NotificationController from '../app/controllers/NotificationController';

import authMiddleware from '../app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  post: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

routes.get('/', (req, res) => res.send('Servidor iniciado!'));

routes.post('/user', bruteForce.prevent, UserController.store);
routes.post('/session', bruteForce.prevent, SessionController.store);

routes.use(authMiddleware);

routes.put('/user', UserController.update);
routes.get('/user/:id', UserController.index);

routes.get('/post', PostController.index);
routes.post('/post', PostController.store);
routes.put('/post/:id', PostController.update);
routes.delete('/post/:id', PostController.delete);

routes.get('/post/:id/comment', CommentController.index);
routes.post('/post/:id/comment', CommentController.store);
routes.put('/post/:id/comment/:comment', CommentController.update);
routes.delete('/post/:id/comment/:comment', CommentController.delete);

routes.post('/post/:id/like', LikeController.store);
routes.delete('/post/:id/like', LikeController.delete);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
