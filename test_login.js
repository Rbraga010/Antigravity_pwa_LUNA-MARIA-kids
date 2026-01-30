const fetch = require('node-fetch');

async function testLogin() {
    try {
        console.log('🔍 Testando login no backend...\n');

        const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'superadm@lunakids.com',
                password: 'Luna@2026!Admin'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ Login bem-sucedido!');
            console.log('Token:', data.token);
            console.log('User:', data.user);
        } else {
            console.log('\n❌ Falha no login');
        }
    } catch (error) {
        console.error('\n❌ Erro ao conectar com o backend:', error.message);
        console.log('\n💡 Verifique se o backend está rodando em http://localhost:3001');
    }
}

testLogin();
