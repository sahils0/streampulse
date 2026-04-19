import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool';

const PRIVATE_KEY = Buffer.from(process.env.JWT_PRIVATE_KEY!, 'base64').toString('utf-8');
console.log('Private key starts with:', PRIVATE_KEY.slice(0, 27));


export async function register(email: string, password: string) {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) throw new Error('Email already in use');

    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, hash]
    );
    return { token: signToken(result.rows[0].id) };
}

export async function login(email: string, password: string) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new Error('Invalid credentials');
    }
    return { token: signToken(user.id) };
}

function signToken(userId: string) {
    return jwt.sign(
        { sub: userId },
        PRIVATE_KEY,
        {
            algorithm: 'RS256',
            expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as jwt.SignOptions['expiresIn'],
        }
    );
}