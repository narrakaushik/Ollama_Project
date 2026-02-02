# System Architecture & Development Plan

## 1. Project Overview
This is a **Local RAG (Retrieval-Augmented Generation) Application** that acts as an AI-powered product catalog assistant.
- **Frontend**: Angular (v16+)
- **Backend**: Node.js / Express
- **Database**: MongoDB (Stores products and vector embeddings)
- **AI/LLM**: Ollama (running locally with `phi3` model)

## 2. Technology Stack
- **Languages**: TypeScript (Frontend), JavaScript (Backend)
- **AI Models**: 
  - **Generation**: `phi3` (via Ollama)
  - **Embeddings**: `phi3` (fallback), recommended to switch to `nomic-embed-text` or `all-minilm` for better quality.
- **Vector Search**: Cosine Similarity (implemented manually in `api.js` for simplicity; production should use a Vector DB).

## 3. Project Structure
```
root/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── data/
│   │   └── products.json    # [SOURCE OF TRUTH] Static product data
│   ├── models/
│   │   ├── Product.js       # Mongoose schema for products
│   │   └── Embedding.js     # Mongoose schema for vector embeddings
│   ├── routes/
│   │   └── api.js           # Main API (Chat, Seed, Recommendations)
│   ├── scripts/
│   │   └── indexer.js       # Script to generate & store embeddings
│   ├── services/
│   │   └── ollama.service.js # Wrapper for Ollama API
│   └── server.js            # Entry point
├── frontend/
│   ├── src/app/
│   │   ├── api.service.ts   # Frontend API communication
│   │   ├── chat/            # Chat interface component
│   │   └── ...
└── ...
```

## 4. Key Workflows

### A. Data Seeding (Source of Truth)
 **`POST /api/seed`**
- Reads data from `backend/data/products.json`.
- Clears `products` collection in MongoDB.
- Inserts new products.
- *Does NOT generate embeddings directly.*

### B. Indexing (Vector Generation)
 **`npm run index` (runs `backend/scripts/indexer.js`)**
- Fetches all products from MongoDB.
- Generates embeddings using `ollama.service.js`.
- Stores `(productId, vector, text)` in `embeddings` collection.
- **CRITICAL**: Must be run after seeding or editing `products.json`.

### C. RAG Chat Flow (`POST /api/chat`)
1.  **Receive Limit**: `backend/routes/api.js` receives user message.
2.  **Embed Query**: Calls `generateEmbedding(message)`.
3.  **Vector Search**: Calculates cosine similarity between query vector and all stored embeddings.
    - *Tuning Parameter*: `limit` set to `10` to ensure recall (found in `api.js`).
4.  **Context Construction**: Top partial matches are concatenated into a context string.
5.  **Generation**: Sends `Prompt + Context` to Ollama (`generateCompletion`).
6.  **Response**: Returns AI answer to frontend.

## 5. Setup & Running

### Prerequisites
1.  **Ollama**: Installed and running (`ollama serve`).
2.  **Model**: `ollama pull phi3`.
3.  **MongoDB**: Installed and running locally.

### Start Servers
1.  **Backend**: `cd backend && npm start` (Port 3000)
2.  **Frontend**: `cd frontend && npm start` (Port 4200)

### Initialization
Before first use:
1.  Seed Data: `Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/seed"`
2.  Generate Index: `cd backend && npm run index`

## 6. Future Development Notes (For Agents)
- **Data Source**: Always edit `backend/data/products.json` for product changes, then re-seed and re-index. DO NOT hardcode data in JS files.
- **Ollama Models**: Configured in `backend/services/ollama.service.js`. If you change models, re-run the indexer.
- **Retrieval Tuning**: If AI "doesn't know" an item exists, check `searchVectors` limit in `backend/routes/api.js` or inspect `ollama.service.js` to ensure the embedding model is working.
- **Context Injection**: Debug logs in `api.js` are minimal. To debug RAG, add `console.log` for the `context` variable in `/chat` route.
