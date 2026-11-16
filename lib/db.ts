// lib/db.ts
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;


const globalForPostgres = globalThis as unknown as {
    sql: ReturnType<typeof postgres> | undefined;
};

const sql = globalForPostgres.sql ?? postgres(connectionString, {
    ssl: 'require',
});

if (process.env.NODE_ENV !== 'production') {
    globalForPostgres.sql = sql;
}

export default sql;
