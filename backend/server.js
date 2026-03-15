const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Please send a valid message.' });
        }

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Server is missing DeepSeek API key configuration.' });
        }

        const systemPrompt = [
            'You are the KidBattle AI assistant.',
            'You are a helpful and friendly companion for children.',
            'You can answer educational questions (like math, science, words) directly and simply.',
            'You also help users navigate the KidBattle app features.',
            'Project features include: Alphabet Learning, Bird Learning, Flower Learning (150 flowers), image-based cards, and quizzes.',
            'Answer in clear, short, encouraging sentences suitable for kids.',
            'If asked a question, answer it first. Then, if relevant, suggest a related app feature.'
        ].join(' ');

        const payload = {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message.trim() }
            ]
        };

        const deepSeekResponse = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!deepSeekResponse.ok) {
            const details = await deepSeekResponse.text();
            return res.status(502).json({
                error: 'DeepSeek service is temporarily unavailable. Please try again in a moment.',
                details
            });
        }

        const data = await deepSeekResponse.json();
        const aiResponse = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response right now.';

        return res.json({ response: aiResponse });
    } catch (error) {
        console.error('Chat endpoint error:', error);
        return res.status(500).json({
            error: 'Something went wrong while getting AI response. Please try again.'
        });
    }
});

app.use(express.static(path.resolve(__dirname, '..')));

app.listen(PORT, () => {
    console.log(`KidBattle backend running at http://localhost:${PORT}`);
    console.log('Chat endpoint ready at http://localhost:' + PORT + '/chat');
});
