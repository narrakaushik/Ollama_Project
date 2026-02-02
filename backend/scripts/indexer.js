import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Embedding from '../models/Embedding.js';
import { generateEmbedding } from '../services/ollama.service.js';

const indexProducts = async () => {
    await connectDB();

    try {
        const products = await Product.find({});
        console.log(`Found ${products.length} products to index.`);

        // Clear existing embeddings to start fresh
        await Embedding.deleteMany({});
        console.log('Cleared existing embeddings.');

        for (const product of products) {
            console.log(`Processing product: ${product.name}`);

            const textToEmbed = `${product.name}: ${product.description} Category: ${product.category}`;
            const vector = await generateEmbedding(textToEmbed);

            await Embedding.create({
                productId: product._id,
                vector,
                text: textToEmbed
            });

            console.log(`Indexed ${product.name}`);
        }

        console.log('Indexing complete.');
        process.exit(0);
    } catch (error) {
        console.error('Indexing failed:', error);
        process.exit(1);
    }
};

indexProducts();
