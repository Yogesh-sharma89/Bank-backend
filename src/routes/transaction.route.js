import express from 'express';
import { authMiddleware, authSystemUserMiddleware } from '../middleware/auth.js';
import { createInitialFundTransaction, createTransaction } from '../controller/transaction.controller.js';

const transactionRouter = express.Router();

transactionRouter.post('/',authMiddleware,createTransaction)

transactionRouter.post('/system/initial-fund',authSystemUserMiddleware,createInitialFundTransaction)

export default transactionRouter;
