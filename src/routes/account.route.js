import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createAccount, getAccountBalance, getCurrentUserAllAccounts } from '../controller/account.controller.js';

const accountRouter = express.Router();

accountRouter.post("/",authMiddleware,createAccount);
accountRouter.get('/',authMiddleware,getCurrentUserAllAccounts)

accountRouter.get('/balance/:accountId',authMiddleware,getAccountBalance)

export default accountRouter;
