import cron from 'node-cron';
import axios from 'axios';
import { pool } from '../db/pool';

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
            validateStatus: () => true, // Don't throw on any status code
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
        await pool.query(
            `INSERT INTO check_results (monitor_id, status_code, response_ms, status_ok, error_msg)
             VALUES ($1, $2, $3, $4, $5)`,
            [monitor.id, statusCode, responseMs, statusOk, errorMsg]
        );
        console.log(`Check for ${monitor.url}: ${statusOk ? 'OK' : 'FAIL'} (${responseMs}ms)`);
    } catch (error) {
        console.error(`Error saving check result for ${monitor.id}:`, error);
    }
}
