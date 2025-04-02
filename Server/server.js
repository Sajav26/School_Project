import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongo.js';
import router from './routes/auth.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors({credentials: true}));
app.use(cookieParser());

app.use('/api/auth', router);

app.listen(port, () => (
    console.log(`Server is running on port ${port}`)
));