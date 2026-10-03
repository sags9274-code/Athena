import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_n7o8aPQVlxbh@ep-cold-dust-b44desdt-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require');

export default sql;
