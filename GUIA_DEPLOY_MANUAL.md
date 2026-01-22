# 🚀 Guia Completo de Deploy Manual - Luna Maria Kids

## ✅ Status da Fase 1 - CONCLUÍDO

### O que foi feito:

1. ✅ **Banco de Dados Validado**
   - Conexão com Supabase PostgreSQL funcionando
   - Schema Prisma sincronizado
   - Tabelas criadas corretamente

2. ✅ **Autenticação Testada**
   - Registro de usuário funcional
   - Login funcional
   - JWT gerado corretamente
   - Endpoint `/auth/me` validado

3. ✅ **Build Testado**
   - Frontend compilado com sucesso (Vite)
   - Backend compilado com sucesso (TypeScript)
   - Sem erros de compilação

4. ✅ **Código Enviado para GitHub**
   - Commit: `feat: fase 1 estabilização - db validado, auth funcional, deploy otimizado`
   - Branch: `main`
   - Arquivos atualizados:
     - `vercel.json` (otimizado)
     - `api/index.ts` (corrigido)
     - `.env.example` (criado)
     - `DEPLOY.md` (criado)
     - `frontend/.env` (criado)

---

## 📋 Passo a Passo para Deploy no Vercel

### **Passo 1: Acessar Vercel**

1. Acesse: https://vercel.com/new
2. Faça login com sua conta GitHub

### **Passo 2: Importar Repositório**

1. Clique em **"Continue with GitHub"**
2. Na lista de repositórios, procure por: **Antigravity_pwa_LUNA-MARIA-kids**
3. Clique em **"Import"**

### **Passo 3: Configurar Projeto**

O Vercel detectará automaticamente:
- Framework: **Vite**
- Build Command: `npm run build`
- Output Directory: `frontend/dist`

**NÃO ALTERE ESSAS CONFIGURAÇÕES** - elas estão corretas no `vercel.json`

### **Passo 4: Adicionar Variáveis de Ambiente**

Clique em **"Environment Variables"** e adicione as seguintes variáveis:

#### Backend Variables:
```
DATABASE_URL
postgresql://postgres:l00LUInxEUfQGuaq@db.ndtruowssuqgwicnumlu.supabase.co:5432/postgres?sslmode=require

JWT_SECRET
luna-maria-kids-secret-key-2026

GEMINI_API_KEY
AIzaSyA_q_EfwAgmg6_1s064l8-9v1x_8Gvw_WA
```

#### Frontend Variables:
```
VITE_API_KEY
AIzaSyA_q_EfwAgmg6_1s064l8-9v1x_8Gvw_WA
```

**IMPORTANTE:** Certifique-se de que todas as variáveis estão marcadas para **Production, Preview e Development**.

### **Passo 5: Deploy**

1. Clique em **"Deploy"**
2. Aguarde o build (leva cerca de 2-3 minutos)
3. Após conclusão, você receberá uma URL de produção

---

## 🔗 URLs Esperadas

Após o deploy, você terá:

- **Frontend:** `https://antigravity-pwa-luna-maria-kids.vercel.app`
- **Backend API:** `https://antigravity-pwa-luna-maria-kids.vercel.app/api/*`

---

## 🧪 Como Testar Após Deploy

### 1. Testar Health Check da API

```bash
curl https://SEU-DOMINIO.vercel.app/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "Luna Maria Kids API is running"
}
```

### 2. Testar Registro de Usuário

```bash
curl -X POST https://SEU-DOMINIO.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Usuario",
    "email": "teste@example.com",
    "password": "senha123",
    "phone": "11999999999",
    "numChildren": 1,
    "childrenDetails": [
      {
        "name": "Criança Teste",
        "birthDate": "2020-01-15",
        "gender": "menina"
      }
    ]
  }'
```

### 3. Testar Login

```bash
curl -X POST https://SEU-DOMINIO.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

### 4. Acessar Frontend

Abra no navegador: `https://SEU-DOMINIO.vercel.app`

Você deve ver:
- Logo Luna Maria Kids
- Carrosséis de banners
- Seção de produtos
- Botão de login/registro

---

## 🔧 Troubleshooting

### Problema: Build falha

**Solução:**
1. Verifique os logs do build no Vercel
2. Certifique-se de que todas as variáveis de ambiente foram adicionadas
3. Verifique se o comando de build está correto: `npm run build`

### Problema: API retorna 404

**Solução:**
1. Verifique se o arquivo `api/index.ts` existe
2. Certifique-se de que o `vercel.json` tem a configuração de rewrite correta
3. Verifique se as variáveis de ambiente do backend foram adicionadas

### Problema: Frontend carrega mas API não responde

**Solução:**
1. Verifique se a variável `DATABASE_URL` está correta
2. Teste o endpoint `/api/health` diretamente
3. Verifique os logs do Vercel em: Settings > Functions

### Problema: Erro de CORS

**Solução:**
O backend já está configurado com CORS habilitado. Se ainda houver erro:
1. Verifique se o domínio está correto
2. Certifique-se de que as requisições estão usando HTTPS

---

## 📊 Monitoramento

Após o deploy, monitore:

1. **Logs do Vercel:**
   - Acesse: https://vercel.com/dashboard
   - Clique no projeto
   - Vá em "Functions" para ver logs da API

2. **Analytics:**
   - Vá em "Analytics" no dashboard do Vercel
   - Monitore tráfego e performance

3. **Banco de Dados:**
   - Acesse o Supabase: https://supabase.com/dashboard
   - Verifique tabelas e dados

---

## 🎯 Próximos Passos (Fase 2)

Após o deploy bem-sucedido:

1. ✅ Testar fluxo completo de compra
2. ✅ Configurar Mercado Pago em produção
3. ✅ Testar provador inteligente com Gemini
4. ✅ Configurar domínio customizado (opcional)
5. ✅ Implementar monitoramento de erros (Sentry)

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Vercel
2. Teste os endpoints da API diretamente
3. Verifique se todas as variáveis de ambiente estão corretas
4. Consulte a documentação do Vercel: https://vercel.com/docs

---

## 🔐 Credenciais de Teste

**Usuário já criado no banco:**
- Email: `teste@example.com`
- Senha: `senha123`

**Super Admin:**
- Email: `Lunamariakids_adm@lmkids.com`
- Senha: (criar no primeiro acesso)

---

## ✨ Resumo

✅ Banco de dados funcionando
✅ Autenticação funcionando
✅ Build testado e funcionando
✅ Código no GitHub atualizado
✅ Configuração do Vercel otimizada
✅ Variáveis de ambiente documentadas

**Pronto para deploy em produção!** 🚀
