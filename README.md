## FACULDADE GRAN (https://faculdade.grancursosonline.com.br/) 
Projeto Disciplina Projeto Integrador

# Projeto Fullstack — Express + Prisma + SQLite + Next.js

Este projeto é composto por um **backend** em Node.js com Express e Prisma (utilizando SQLite como banco de dados), e um **frontend** em React com Next.js.

---

## 🗂 Estrutura de Diretórios

```
.
├── backend/      # API REST em Node.js + Express + Prisma
└── frontend/     # Aplicação Web em React com Next.js
```

---

## 🛠 Pré-requisitos

- Node.js (>= 18)
- npm ou yarn
- [Insomnia](https://insomnia.rest/) (opcional, para testar a API)

---

## 📥 Instalação Local Completa

Siga os passos abaixo para subir o projeto localmente:

### 🔁 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 📦 2. Instale as dependências

#### Backend

```bash
cd backend
npm install
```

#### Frontend (em outro terminal ou aba)

```bash
cd frontend
npm install
```

### ⚙️ 3. Configure o ambiente

Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:

```env
DATABASE_URL="file:./dev.db"
```

### 🧱 4. Rode as migrações do banco de dados

```bash
cd backend
npx prisma migrate dev --name init
```

### 🚀 5. Inicie o backend

```bash
npm run dev
```

### 🌍 6. Inicie o frontend

Abra outro terminal:

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001/api`

---

## 🔁 Rotas da API

| Método | Rota                | Ação              |
|--------|---------------------|-------------------|
| GET    | `/api/users`        | Listar usuários   |
| POST   | `/api/users`        | Criar usuário     |
| GET    | `/api/users/:id`    | Buscar usuário    |
| PUT    | `/api/users/:id`    | Atualizar usuário |
| DELETE | `/api/users/:id`    | Deletar usuário   |

---

## 🧪 Exemplo de criação via Insomnia

- **POST** `http://localhost:3001/api/users`
- **Body (JSON):**

```json
{
  "name": "Ely Frank",
  "email": "ely@example.com"
}
```

---

## 🧼 Comandos úteis

| Comando                             | Descrição                        |
|-------------------------------------|----------------------------------|
| `npx prisma migrate dev`            | Cria banco e aplica migrações    |
| `npx prisma studio`                 | Interface web para o banco       |
| `npx prisma generate`               | Atualiza o cliente Prisma        |
| `npm run dev` (backend/frontend)    | Inicia ambiente de desenvolvimento |

---

## 🧑‍💻 Autor

> Projeto desenvolvido por Ely Frank - Matrícula 5491084