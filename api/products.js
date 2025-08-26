import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(req, res) {
  try {
    // This securely connects to your Neon database using the environment variable
    const sql = neon(process.env.DATABASE_URL);
    
    // This queries your 'products' table
    const products = await sql`SELECT * FROM products`;

    // This sends the product data back to your front-end
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Database query failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
