import Product from '../models/Product.js';
import Embedding from '../models/Embedding.js';
import { generateEmbedding } from '../services/ollama.service.js';

// Helper to formulate text for embedding
const getEmbeddingText = (product) => {
    return `${product.name}: ${product.description} Category: ${product.category}`;
};

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, imageUrl } = req.body;
        console.log('Creating product:', name);

        // 1. Save Product
        const product = new Product({ name, description, price, category, imageUrl });
        await product.save();

        // 2. Generate & Save Embedding
        const textToEmbed = getEmbeddingText(product);
        console.log('Generating embedding for:', textToEmbed);
        const vector = await generateEmbedding(textToEmbed);
        console.log('Embedding generated.');

        const embedding = new Embedding({
            productId: product._id,
            vector,
            text: textToEmbed
        });
        await embedding.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }); // Newest first
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const product = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // 2. Check if text fields changed, if so, regenerate embedding
        // Ideally we check if name/desc/category changed. For simplicity, we regen always on update for now or check fields.
        if (updates.name || updates.description || updates.category) {
            const textToEmbed = getEmbeddingText(product);
            const vector = await generateEmbedding(textToEmbed);

            await Embedding.findOneAndUpdate(
                { productId: product._id },
                { vector, text: textToEmbed },
                { upsert: true } // Create if missing
            );
        }

        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Delete Product
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // 2. Delete Embedding
        await Embedding.findOneAndDelete({ productId: id });

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
