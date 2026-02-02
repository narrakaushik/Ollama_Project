# AI RAG & Recommendation System (Ollama + Node.js + Angular)

This project demonstrates a local AI integration using:
- **Backend**: Node.js v16+ (Express) with MongoDB.
- **Frontend**: Angular v16.
- **AI Engine**: Ollama (running locally).
- **Features**:
  - **Chat with Database (RAG)**: Ask questions about your products and get answers based on stored data.
  - **Smart Recommendations**: Get product suggestions based on similar items (ID) or user preference (text) using vector embeddings.

## Prerequisites

1.  **Node.js**: v16 or higher.
2.  **MongoDB**: Installed and running locally (`mongodb://127.0.0.1:27017`).
3.  **Ollama**: Installed and running.
    - [Download Ollama](https://ollama.ai)
    - Pull the required models:
      ```bash
      ollama pull embeddinggemma
      ollama pull gemma3
      ```
    - Ensure it is running on port 11434 (default).

## Installation

### 1. Backend Setup

Open a terminal in the `backend` folder:

```bash
cd backend
npm install
```

Create a `.env` file (optional, defaults are set in code):
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/ollama_project
```

### 2. Frontend Setup

Open a new terminal in the `frontend` folder:

```bash
cd frontend
npm install
```

## Running the Project

### Step 1: Start Backend

In the `backend` terminal:

```bash
npm start
```
*Server should start on http://localhost:3000*

### Step 2: Seed & Index Data

You need to populate the database and generate vector embeddings for the AI to work.

1.  **Seed Data**: You can do this via the Frontend UI button "Seed Data" (easiest) or using a tool like Postman to POST `http://localhost:3000/api/seed`.
2.  **Index Data**: Run the indexer script **after** seeding data.

Open a terminal in `backend` and run:
```bash
npm run index
```
*This will read all products, generate embeddings using Ollama, and save them.*

### Step 3: Start Frontend

In the `frontend` terminal:

```bash
npm start
```
*Access the app at http://localhost:4200*

## API Endpoints

- `POST /api/chat`: RAG Chatbot. Body: `{ "message": "..." }`
- `POST /api/recommendations`: Get Recs. Body: `{ "productId": "..." }` OR `{ "text": "..." }`
- `POST /api/seed`: Reset and seed dummy products.
- `GET /api/products`: List products.

## How to Add More Products

1.  Add products directly to MongoDB (using Compass or CLI) into the `products` collection.
2.  **Re-run the indexer** to generate embeddings for the new products:
    ```bash
    cd backend
    npm run index
    ```
    *Note: The current indexer script clears and re-indexes everything. For production, you would only index new items.*

## Project Structure

- `backend/`: Express server, Ollama service, and Indexer script.
- `frontend/`: Angular application with Chat and Recommendation components.

## Troubleshooting

- **Ollama Connection Error**: Ensure Ollama is running (`ollama serve`). Check if `http://localhost:11434` is accessible.
- **MongoDB Error**: Ensure `mongod` is running.
- **Node Version**: Check `node -v` is >= 16.
