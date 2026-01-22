
async function testProductionAPI() {
    console.log('🔍 TESTANDO API EM PRODUÇÃO\n');

    const baseUrl = 'https://antigravity-pwa-luna-maria-kids.vercel.app';

    // 1. Testar se o site está no ar
    console.log('1️⃣ Testando se o site está acessível...');
    try {
        const siteResponse = await fetch(baseUrl);
        console.log(`   ✅ Site acessível! Status: ${siteResponse.status}\n`);
    } catch (error) {
        console.log(`   ❌ Site não acessível: ${error}\n`);
        return;
    }

    // 2. Testar endpoint de registro
    console.log('2️⃣ Testando endpoint de registro...');
    const testEmail = `teste.producao.${Date.now()}@exemplo.com`;

    try {
        const response = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Teste Produção Vercel',
                email: testEmail,
                password: 'senhaSegura123',
                phone: '11999887766',
                numChildren: 1,
                childrenDetails: [{ name: 'Filho Teste Prod', birthDate: '2020-06-15' }]
            })
        });

        console.log(`   Status da resposta: ${response.status}`);

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (response.ok) {
                console.log('   ✅ CADASTRO FUNCIONOU EM PRODUÇÃO!');
                console.log(`   Usuário criado: ${testEmail}`);
                console.log(`   Token recebido: ${data.token ? 'Sim' : 'Não'}\n`);
            } else {
                console.log('   ❌ Erro no cadastro:');
                console.log(`   ${JSON.stringify(data, null, 2)}\n`);
            }
        } else {
            const text = await response.text();
            console.log('   ⚠️ Resposta não é JSON:');
            console.log(`   ${text.substring(0, 500)}\n`);
        }
    } catch (error) {
        console.log(`   ❌ Erro ao conectar com API: ${error}\n`);
    }

    // 3. Testar health check
    console.log('3️⃣ Testando health check do backend...');
    try {
        const healthResponse = await fetch(`${baseUrl}/api/health`);
        if (healthResponse.ok) {
            const health = await healthResponse.json();
            console.log(`   ✅ Backend health: ${JSON.stringify(health)}\n`);
        } else {
            console.log(`   ⚠️ Health check retornou: ${healthResponse.status}\n`);
        }
    } catch (error) {
        console.log(`   ❌ Health check falhou: ${error}\n`);
    }
}

testProductionAPI();
