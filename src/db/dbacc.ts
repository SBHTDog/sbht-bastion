import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT || "5432"),
            user: process.env.DB_USERNAME || "postgres",
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || "postgres",
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            ssl: {
                rejectUnauthorized: false, // For AWS RDS
            },
        });
    }
    return pool;
}

export async function query(text: string, params?: any[]) {
    const pool = getPool();
    return await pool.query(text, params);
}

export async function createWebhookRecord(payload: any) {
    const sql = `
        INSERT INTO github_webhooks (payload, created_at)
        VALUES ($1, NOW())
        RETURNING id, created_at
    `;
    const result = await query(sql, [JSON.stringify(payload)]);
    return result.rows[0];
}
