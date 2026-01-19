import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:l00LUInxEUfQGuaq@db.ndtruowssuqgwicnumlu.supabase.co:5432/postgres";

const client = new Client({
    connectionString,
});

async function test() {
    try {
        console.log("Tentando conectar ao Supabase...");
        await client.connect();
        console.log("Conectado com sucesso!");
        const res = await client.query('SELECT NOW()');
        console.log("Resposta do banco:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Erro na conexão:", err);
        process.exit(1);
    }
}

test();
