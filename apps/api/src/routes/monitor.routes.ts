import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.middleware';
import * as monitorService from '../services/monitor.service';

const router = Router();

const monitorSchema = z.object({
    url: z.url(),
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']).optional(),
    interval_secs: z.number().min(10).max(3600).optional(),
    timeout_ms: z.number().min(100).max(30000).optional(),
    expected_status: z.number().min(100).max(599).optional(),
    sla_uptime_pct: z.number().min(0).max(100).optional(),
});

const updateMonitorSchema = monitorSchema.partial().extend({
    is_active: z.boolean().optional(),
});

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const data = monitorSchema.parse(req.body);
        const monitor = await monitorService.createMonitor((req as any).userId, data);
        res.status(201).json(monitor);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.issues });
        } else {
            res.status(500).json({ error: (error as Error).message });
        }
    }
});

router.get('/', async (req, res) => {
    try {
        const monitors = await monitorService.getMonitors((req as any).userId);
        res.json(monitors);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const monitor = await monitorService.getMonitorById((req as any).userId, req.params.id);
        if (!monitor) return res.status(404).json({ error: 'Monitor not found' });
        res.json(monitor);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const data = updateMonitorSchema.parse(req.body);
        const monitor = await monitorService.updateMonitor((req as any).userId, req.params.id, data);
        if (!monitor) return res.status(404).json({ error: 'Monitor not found' });
        res.json(monitor);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.issues });
        } else {
            res.status(500).json({ error: (error as Error).message });
        }
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const success = await monitorService.deleteMonitor((req as any).userId, req.params.id);
        if (!success) return res.status(404).json({ error: 'Monitor not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
