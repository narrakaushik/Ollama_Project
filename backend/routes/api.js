import express from 'express';
import Product from '../models/Product.js';
import Embedding from '../models/Embedding.js';
import { generateEmbedding, generateCompletion } from '../services/ollama.service.js';
import * as ProductController from '../controllers/product.controller.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper to calculate Cosine Similarity
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

// Helper to search vectors
const searchVectors = async (queryVector, limit = 5) => {
    // Fetch all embeddings (For production, use a Vector DB like Atlas Vector Search, Pinecone, etc.)
    // For this local demo, we load all into memory.
    const allEmbeddings = await Embedding.find().populate('productId');

    const results = allEmbeddings.map(emb => {
        // Handle cases where productId might be null if product was deleted
        if (!emb.productId) return null;

        return {
            product: emb.productId,
            score: cosineSimilarity(queryVector, emb.vector)
        };
    })
        .filter(item => item !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return results;
};

// POST /api/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // 1. Generate embedding for query
        const queryVector = await generateEmbedding(message);

        // 2. Search for relevant products
        const rawResults = await searchVectors(queryVector, 10); // Check top 10 items
        const context = rawResults.map(r => `${r.product.name}: ${r.product.description} (Price: $${r.product.price})`).join('\n');


        // 3. Generate Answer
        const response = await generateCompletion(message, context);

        res.json({ response, context: rawResults }); // Return context for debugging/UI if needed
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/recommendations
router.post('/recommendations', async (req, res) => {
    try {
        const { productId, text } = req.body;
        let queryVector;

        if (productId) {
            const emb = await Embedding.findOne({ productId });
            if (!emb) return res.status(404).json({ error: 'Product not found or not indexed' });
            queryVector = emb.vector;
        } else if (text) {
            queryVector = await generateEmbedding(text);
        } else {
            return res.status(400).json({ error: 'Provide productId or text' });
        }

        // Search, excluding the query product itself if productId provided
        const allEmbeddings = await Embedding.find().populate('productId');
        const results = allEmbeddings.map(emb => {
            if (!emb.productId) return null;
            // If recommending based on productId, skip the same product
            if (productId && emb.productId._id.toString() === productId) return null;

            return {
                product: emb.productId,
                score: cosineSimilarity(queryVector, emb.vector)
            };
        })
            .filter(item => item !== null)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Return top 5

        res.json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// CRUD Routes for Products
router.get('/products', ProductController.getAllProducts);
router.post('/products', ProductController.createProduct);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

// Legacy GET for UI (replaced by getAllProducts above, but keeping structure compliant)
// router.get('/products', async (req, res) => { ... }) replaced.

// POST /api/seed - Removed as per dynamic requirement. Use POST /api/products or the UI to add data.
router.post('/seed', async (req, res) => {
    res.status(410).json({ error: "Static seeding is disabled. Please use the Product Manager UI to add products." });
});

export default router;
