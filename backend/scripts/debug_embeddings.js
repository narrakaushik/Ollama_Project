import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Embedding from '../models/Embedding.js';
import Product from '../models/Product.js';

connectDB();

const check = async () => {
    try {
        const count = await Embedding.countDocuments();
        console.log(`Total Embeddings: ${count}`);

        const products = await Embedding.find().populate('productId');
        console.log('Sample Embedding Product:', products[0]?.productId?.name);

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

check();
