import { Router } from 'express';
import { register, login } from '../services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();
router.use(authRateLimiter);

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await register(email, password);
        res.status(201).json(data);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await login(email, password);
        res.json(data);
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
}), authMiddleware;

export default router;