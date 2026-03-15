const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required.' });
        }

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'DeepSeek API key not configured.' });
        }

        const systemPrompt = `You are KidBattle Chatbot. Answer questions about the KidBattle project (Alphabet Learning, Bird Learning, Flower Learning, Image-based learning, and kid-friendly learning UI) in a cheerful kid-friendly tone.`;

        const payload = {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ]
        };

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(502).json({ error: 'DeepSeek API error', details: text });
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || data?.output || 'Sorry, I could not generate a response.';

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Chat endpoint error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.use(express.static(path.join(__dirname, '/')));

app.listen(PORT, () => {
    console.log(`KidBattle backend running at http://localhost:${PORT}`);
});
