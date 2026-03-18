import express from 'express';
import { pool } from './db/pool';

const app = express();
app.use(express.json());

pool.query('SELECT 1').then(() => {
    console.log('✅ DB connected');
}).catch(err => {
    console.error('❌ DB connection failed', err);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));