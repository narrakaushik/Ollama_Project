import mongoose from 'mongoose';

const EmbeddingSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    vector: { type: [Number], required: true },
    text: { type: String } // The text content that was embedded
});

export default mongoose.model('Embedding', EmbeddingSchema);
