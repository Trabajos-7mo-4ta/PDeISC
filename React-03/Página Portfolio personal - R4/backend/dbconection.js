import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres.svddbjorxsukujcflxnx:portafolio123@aws-1-sa-east-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false } // necesario para Supabase
});

export default pool;