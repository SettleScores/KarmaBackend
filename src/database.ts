import { Pool } from 'pg';

export  const pool = new Pool({
   user: 'postgres',
   host: 'localhost',
   password: 'postgres',
   database: 'Task',
   port: 5432,
   idleTimeoutMillis: 0,
   connectionTimeoutMillis: 0
});
