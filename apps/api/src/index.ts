import express from 'express';
import { pool } from './db/pool';
import authRouter from './routes/auth.routes';
import 'dotenv/config';

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use('/auth', authRouter);

pool.query('SELECT 1').then(() => {
    console.log('✅ DB connected');
}).catch(err => {
    console.error('❌ DB connection failed', err);
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));