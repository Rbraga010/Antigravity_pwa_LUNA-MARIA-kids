# Guia de Deploy - Luna Maria Kids

## Variáveis de Ambiente Necessárias no Vercel

Configure as seguintes variáveis de ambiente no painel da Vercel:

### Backend
```
DATABASE_URL=postgresql://postgres:l00LUInxEUfQGuaq@db.ndtruowssuqgwicnumlu.supabase.co:5432/postgres?sslmode=require
JWT_SECRET=luna-maria-kids-secret-key-2026
GEMINI_API_KEY=AIzaSyA_q_EfwAgmg6_1s064l8-9v1x_8Gvw_WA
PORT=3001
```

### Frontend
```
VITE_API_KEY=AIzaSyA_q_EfwAgmg6_1s064l8-9v1x_8Gvw_WA
```

## Passos para Deploy

1. **Conectar repositório ao Vercel**
   - Acesse https://vercel.com/new
   - Importe o repositório `Rbraga010/Antigravity_pwa_LUNA-MARIA-kids`

2. **Configurar variáveis de ambiente**
   - No painel do projeto, vá em Settings > Environment Variables
   - Adicione todas as variáveis listadas acima

3. **Deploy automático**
   - O Vercel detectará automaticamente a configuração do `vercel.json`
   - O build será executado automaticamente

## Testado e Funcional

✅ Banco de dados Supabase conectado
✅ Registro de usuário funcional
✅ Login funcional
✅ JWT funcionando
✅ Build do frontend OK
✅ Build do backend OK

## Estrutura de Deploy

- **Frontend**: Servido como site estático do Vite (porta 3000 local)
- **Backend**: Servido como serverless functions via `/api/*` (porta 3001 local)
- **Banco**: PostgreSQL no Supabase

## Endpoints Principais

- `GET /api/health` - Health check
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil do usuário (requer autenticação)
- `GET /api/products` - Lista de produtos
- `POST /api/orders` - Criar pedido
- `POST /api/try-on/generate` - Provador inteligente (requer assinatura)

## Credenciais de Teste

Email: teste@example.com
Senha: senha123

## Super Admin

Email especial que recebe role SUPER_ADMIN automaticamente:
`Lunamariakids_adm@lmkids.com`
