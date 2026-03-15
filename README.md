# 💬 Chat With Your Database

A Gen AI project that lets you query your MongoDB database using plain English.
Ask questions like _"how many users are active?"_ or _"what is the total revenue?"_
and get instant, conversational answers — powered by **Groq AI (LLaMA 3.3 70B)**.

---

## 🧠 How It Works

```
Your Question (Natural Language)
        ↓
Groq AI analyzes your MongoDB schema
        ↓
Generates a MongoDB query (JSON)
        ↓
Query runs against your database
        ↓
Groq AI explains the results
        ↓
Plain English Answer
```

The **Database Overview** cards are fetched directly from the API (no AI).
Use them to verify if the AI answers are correct.

The **Chat** connects to Groq AI, which reads your schema and queries
the database directly — it does not use the overview data.

---

## 🛠️ Tech Stack

| Layer    | Tech                     |
| -------- | ------------------------ |
| AI       | Groq API — LLaMA 3.3 70B |
| Backend  | Node.js + Express        |
| Database | MongoDB Atlas            |
| ODM      | Mongoose                 |
| Frontend | React + Vite + Chakra UI |

---

## 📁 Project Structure

```
talk-with-db/
│
├── backend/
│   ├── models/
│   │   ├── user.js
│   │   ├── product.js
│   │   └── order.js
│   ├── routes/
│   │   ├── userRoute.js
│   │   ├── productRoute.js
│   │   ├── orderRoute.js
│   │   └── chatRoute.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── chatController.js
│   ├── schema.js         # Extracts mongoose schema dynamically
│   ├── grok.js           # Groq API — text to query & results to answer
│   ├── executor.js       # Safe MongoDB query runner
│   ├── seed.js           # Sample data generator
│   ├── server.js         # Express server
│   └── .env              # Environment variables (not committed)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── StatsSection.jsx   # Database overview cards
    │   │   └── ChatSection.jsx    # AI chat interface
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   └── NotFound.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/balankdharan/talk-with-db.git
cd talk-with-db
```

### 2. Setup backend

```bash
cd backend
npm install
```

### 3. Create `.env` file in `/backend`

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
GROQ_API_KEY=gsk_your-key-here
PORT=5000
```

> Get your Groq API key for free at [console.groq.com](https://console.groq.com)

### 4. Seed the database with sample data

```bash
npm run seed
```

This will create:

- 👤 8 Users (6 active, 2 inactive)
- 📦 13 Products across 4 categories
- 🛒 11 Orders (delivered, shipped, pending, cancelled)

### 5. Start the backend

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 6. Setup and start frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 💡 Example Questions to Ask

```
"How many users are active?"
"What is the total revenue?"
"Show me all pending orders"
"Which products are out of stock?"
"How many orders were delivered?"
"Show me orders from Chennai"
"What is the most expensive product?"
"How many products are in the electronics category?"
```

---

## 🔌 API Endpoints

### Chat

| Method | Endpoint    | Description                        |
| ------ | ----------- | ---------------------------------- |
| POST   | `/api/chat` | Ask a question about your database |

### Users

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | `/api/users`     | Get all users |
| POST   | `/api/users`     | Create a user |
| DELETE | `/api/users/:id` | Delete a user |

### Products

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| GET    | `/api/products`     | Get all products |
| POST   | `/api/products`     | Create a product |
| DELETE | `/api/products/:id` | Delete a product |

### Orders

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | `/api/orders`     | Get all orders  |
| POST   | `/api/orders`     | Create an order |
| DELETE | `/api/orders/:id` | Delete an order |

---

## 🧩 Key Concepts

**Prompt Engineering** — The core AI technique used in this project.
The MongoDB schema is dynamically extracted and injected into the Groq prompt
so the AI understands your database structure before generating queries.

**Schema Extraction** — `schema.js` reads your Mongoose model files at startup,
recursively extracts all field names, types, enums, and refs — including nested
objects and arrays — and formats them as a clean string for the AI prompt.

**Safe Query Execution** — `executor.js` only allows `find`, `aggregate`, and `count`
operations. Write operations are blocked entirely.

**Session History** — Each chat session maintains the last 10 turns of conversation,
so the AI understands follow-up questions in context.

---

## ⚠️ Important Notes

- This project is for **read-only** queries. Write operations are blocked for safety.
- The AI queries your **live database** — make sure your Atlas IP whitelist is configured.
- Session history is stored **in memory** and resets when the server restarts.
- The database overview cards are fetched via the **REST API**, not through AI.

---

## 📄 License

MIT
