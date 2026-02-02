@echo off
echo Seeding Database...
curl -X POST http://localhost:3000/api/seed
echo.
echo Indexing Products (Generating Embeddings)...
cd backend
npm run index
pause
