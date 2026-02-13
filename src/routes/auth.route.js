import express from 'express';
import { Login, Logout, Register } from '../controller/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/register',Register)

authRouter.post('/login',Login)

authRouter.post('/logout',authMiddleware,Logout);

export default authRouter;