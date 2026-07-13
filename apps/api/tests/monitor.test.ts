import request from 'supertest';
import { app } from '../src/index';
import { pool } from '../src/db/pool';
import jwt from 'jsonwebtoken';

const PRIVATE_KEY = Buffer.from(process.env.JWT_PRIVATE_KEY || '', 'base64').toString('utf-8');

describe('Monitor CRUD API', () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
        // Create a test user
        userId = '00000000-0000-0000-0000-000000000000';
        const email = `test-${Date.now()}@example.com`;
        await pool.query('INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING', [
            userId,
            email,
            'hashed_password'
        ]);
        token = jwt.sign({ sub: userId }, PRIVATE_KEY, { algorithm: 'RS256' });
    });

    afterAll(async () => {
        await pool.query('DELETE FROM monitors WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        await pool.end();
    });

    it('should create a new monitor', async () => {
        const res = await request(app)
            .post('/monitors')
            .set('Authorization', `Bearer ${token}`)
            .send({
                url: 'https://google.com',
                method: 'GET',
                interval_secs: 60,
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.url).toBe('https://google.com');
    });

    it('should list monitors', async () => {
        const res = await request(app)
            .get('/monitors')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should fail to create monitor with invalid URL', async () => {
        const res = await request(app)
            .post('/monitors')
            .set('Authorization', `Bearer ${token}`)
            .send({
                url: 'not-a-url',
            });

        expect(res.status).toBe(400);
    });
});
