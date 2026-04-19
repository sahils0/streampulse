import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const PUBLIC_KEY = Buffer.from(process.env.JWT_PUBLIC_KEY!, 'base64').toString('utf-8');

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const payload = jwt.verify(header.slice(7), PUBLIC_KEY, { algorithms: ['RS256'] });
        (req as any).userId = (payload as any).sub;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}