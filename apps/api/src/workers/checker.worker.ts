import cron from 'node-cron';
import axios from 'axios';
import { pool } from '../db/pool';
import { publishCheckResult } from '../kafka/producer';

export function startChecker() {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        console.log('--- Running Health Checks ---');
        try {
            const monitors = await pool.query('SELECT * FROM monitors WHERE is_active = TRUE');
            
            for (const monitor of monitors.rows) {
                await checkMonitor(monitor);
            }
        } catch (error) {
            console.error('Error fetching monitors for check:', error);
        }
    });
}

async function checkMonitor(monitor: any) {
    const start = Date.now();
    let statusCode: number | null = null;
    let responseMs: number | null = null;
    let statusOk = false;
    let errorMsg: string | null = null;

    try {
        const response = await axios({
            method: monitor.method,
            url: monitor.url,
            timeout: monitor.timeout_ms,
            validateStatus: () => true,
        });

        statusCode = response.status;
        responseMs = Date.now() - start;
        statusOk = statusCode === monitor.expected_status;
    } catch (error: any) {
        responseMs = Date.now() - start;
        errorMsg = error.message;
        statusOk = false;
    }

    try {
        await publishCheckResult({
            monitor_id: monitor.id,
            status_code: statusCode,
            response_ms: responseMs,
            status_ok: statusOk,
            error_msg: errorMsg,
            checked_at: new Date().toISOString(),
        });
        console.log(`Check for ${monitor.url}: ${statusOk ? 'OK' : 'FAIL'} (${responseMs}ms) → Kafka`);
    } catch (error) {
        console.error(`Error publishing check result for ${monitor.id}:`, error);
    }
}
