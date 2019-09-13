import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';

import UserController from '../app/controllers/UserController';
import SessionController from '../app/controllers/SessionController';
import FileController from '../app/controllers/FileController';
import PostController from '../app/controllers/PostController';

import authMiddleware from '../app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => res.send('Servidor iniciado!'));

routes.post('/user', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/user', UserController.update);
routes.get('/user/:id', UserController.index);

routes.get('/post', PostController.index);
routes.post('/post', PostController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
