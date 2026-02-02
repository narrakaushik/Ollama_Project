import axios from 'axios';

const OLLAMA_BASE_URL = 'http://localhost:11434/api';
// Use models requested by user
const EMBEDDING_MODEL = 'phi3';
const GENERATION_MODEL = 'phi3';

export const generateEmbedding = async (prompt) => {
    try {
        const response = await axios.post(`${OLLAMA_BASE_URL}/embeddings`, {
            model: EMBEDDING_MODEL,
            prompt: prompt
        });
        return response.data.embedding; // Array of floats
    } catch (error) {
        console.error('Error generating embedding:', error.message);
        throw error;
    }
};

export const generateCompletion = async (prompt, context = '') => {
    try {
        // Construct the full prompt with context if provided
        const systemPrompt = "You are a helpful AI assistant for a product catalog. Use the provided context to answer the user's question. If the answer is not in the context, say you don't know.";
        const fullPrompt = `Context: ${context}\n\nQuestion: ${prompt}`;

        const response = await axios.post(`${OLLAMA_BASE_URL}/generate`, {
            model: GENERATION_MODEL,
            prompt: fullPrompt,
            system: systemPrompt,
            stream: false
        });
        return response.data.response;
    } catch (error) {
        console.error('Error generating completion:', error.message);
        throw error;
    }
};

export const OLLAMA_CONFIG = {
    EMBEDDING_MODEL,
    GENERATION_MODEL
};
