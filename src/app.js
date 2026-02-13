import express from 'express'
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import accountRouter from './routes/account.route.js';
import transactionRouter from './routes/transaction.route.js';




const app  = express();

app.use(express.json());
app.use(cors());

app.use(cookieParser())

//main api routes

app.use('/api/auth',authRouter);
app.use('/api/accounts',accountRouter)
app.use('/api/transaction',transactionRouter)


export default app;

