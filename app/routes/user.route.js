import express from 'express'
import UserController from '../http/controllers/user.controller.js';
import UserValidation from '../validators/user.validation.js';
import { Upload } from '../helper/upload.js';

const userRouter = express.Router();

userRouter
    .get('/getMe', UserController.getMe)
    .get('/', UserController.index)
    .get('/:id', UserValidation.find(), UserController.find)
    .post('/avatar', Upload.single('avatar'), UserValidation.updateProfileImage(), UserController.uploadProfileImage)
    .post('/:id/ban', UserValidation.ban(), UserController.banned)

export default userRouter