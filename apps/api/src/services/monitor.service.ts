import { pool } from '../db/pool';

export interface Monitor {
    id: string;
    user_id: string;
    url: string;
    method: string;
    interval_secs: number;
    timeout_ms: number;
    expected_status: number;
    sla_uptime_pct: number;
    is_active: boolean;
    created_at: Date;
}

export async function createMonitor(userId: string, data: Partial<Monitor>) {
    const {
        url,
        method = 'GET',
        interval_secs = 60,
        timeout_ms = 5000,
        expected_status = 200,
        sla_uptime_pct = 99.9,
    } = data;

    const result = await pool.query(
        `INSERT INTO monitors (user_id, url, method, interval_secs, timeout_ms, expected_status, sla_uptime_pct)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, url, method, interval_secs, timeout_ms, expected_status, sla_uptime_pct]
    );
    return result.rows[0];
}

export async function getMonitors(userId: string) {
    const result = await pool.query('SELECT * FROM monitors WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
}

export async function getMonitorById(userId: string, monitorId: string) {
    const result = await pool.query('SELECT * FROM monitors WHERE user_id = $1 AND id = $2', [userId, monitorId]);
    return result.rows[0];
}

export async function updateMonitor(userId: string, monitorId: string, data: Partial<Monitor>) {
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
        if (['url', 'method', 'interval_secs', 'timeout_ms', 'expected_status', 'sla_uptime_pct', 'is_active'].includes(key)) {
            fields.push(`${key} = $${i++}`);
            values.push(value);
        }
    }

    if (fields.length === 0) return null;

    values.push(userId, monitorId);
    const result = await pool.query(
        `UPDATE monitors SET ${fields.join(', ')} WHERE user_id = $${i++} AND id = $${i++} RETURNING *`,
        values
    );
    return result.rows[0];
}

export async function deleteMonitor(userId: string, monitorId: string) {
    const result = await pool.query('DELETE FROM monitors WHERE user_id = $1 AND id = $2 RETURNING id', [userId, monitorId]);
    return result.rowCount ? result.rowCount > 0 : false;
}
