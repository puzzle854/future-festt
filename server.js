const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');

const app = express();
const API_KEY = ''; // substitua pela sua chave de API real

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = 'gemini-1.0-pro';
const GENERATION_CONFIG = {
    temperature: 0.9,
    maxOutputTokens: 2048
};
const SAFETY_SETTINGS = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
];

// Configuração para permitir CORS
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const model = await genAI.getGenerativeModel({ model: MODEL_NAME });

        const chat = await model.startChat({
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
            history: [{ text: message }],
        });

        const response = chat.responses[0]?.text || 'Erro na resposta da IA';
        res.json({ response });
    } catch (error) {
        console.error('Erro na resposta da IA:', error);
        res.status(500).json({ error: 'Erro ao processar a resposta' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
