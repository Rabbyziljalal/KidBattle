/* ===== KIDBATTLE CHATBOT CONFIGURATION ===== */

const ChatbotConfig = {
    // AI API Configuration
    ai: {
        enabled: true,
        provider: 'openai', // 'openai' or 'deepseek'
        apiKey: '', // Add your API key here or in browser console: localStorage.setItem('chatbot_api_key', 'your-key')
        model: 'gpt-3.5-turbo', // or 'deepseek-chat'
        maxTokens: 150,
        temperature: 0.7,
        
        // API Endpoints
        endpoints: {
            openai: 'https://api.openai.com/v1/chat/completions',
            deepseek: 'https://api.deepseek.com/v1/chat/completions'
        }
    },

    // Feature Flags
    features: {
        aiEnabled: true,
        contextAware: true,
        chatHistory: true,
        autoSuggestions: true,
        typingIndicator: true,
        soundEffects: false,
        analytics: true
    },

    // Cache Configuration
    cache: {
        enabled: true,
        maxEntries: 100,
        ttl: 3600000 // 1 hour in milliseconds
    },

    // Database (localStorage) Configuration
    storage: {
        chatLogsKey: 'kidbattle_chat_logs',
        conversationKey: 'kidbattle_conversation',
        cacheKey: 'kidbattle_chat_cache',
        maxLogs: 500,
        maxConversationLength: 50
    },

    // UI Configuration
    ui: {
        maxMessagesDisplay: 100,
        autoScroll: true,
        showTimestamp: false,
        messageDelay: 800,
        typingDelay: 1200
    },

    // Context Data - Information about different pages
    contexts: {
        'index.html': {
            page: 'home',
            title: 'Home Page',
            features: ['games', 'learning', 'navigation'],
            helpText: 'Main dashboard with all learning games and activities'
        },
        'alphabet': {
            page: 'alphabet',
            title: 'Alphabet Learning',
            features: ['letters', 'phonics', 'words'],
            helpText: 'Learn A-Z letters, Bengali alphabet, and numbers'
        },
        'fruit': {
            page: 'fruit',
            title: 'Fruit Learning',
            features: ['fruits', 'names', 'images'],
            helpText: 'Learn about different fruits with pictures and names'
        },
        'vegetable': {
            page: 'vegetable',
            title: 'Vegetable Learning',
            features: ['vegetables', 'names', 'images'],
            helpText: 'Learn about vegetables with pictures and names'
        },
        'animal': {
            page: 'animal',
            title: 'Animal Learning',
            features: ['animals', 'sounds', 'names'],
            helpText: 'Learn about animals with sounds and pictures'
        },
        'bird': {
            page: 'bird',
            title: 'Bird Learning',
            features: ['birds', 'names', 'images'],
            helpText: 'Learn about different bird species'
        },
        'poem': {
            page: 'poem',
            title: 'Poem Learning',
            features: ['poems', 'rhymes', 'reading'],
            helpText: 'Read and learn beautiful poems and rhymes'
        },
        'game': {
            page: 'game',
            title: 'Brain Tug Game',
            features: ['game', 'questions', 'difficulty'],
            helpText: 'Play the Brain Tug-of-War learning game'
        },
        'recognition': {
            page: 'recognition',
            title: 'Recognition Game',
            features: ['recognition', 'upload', 'identify'],
            helpText: 'Upload and identify fruits, vegetables, and animals'
        },
        'color': {
            page: 'color',
            title: 'Color & Mood Game',
            features: ['colors', 'emotions', 'themes'],
            helpText: 'Learn colors and explore different themes'
        },
        'missing': {
            page: 'missing',
            title: 'Missing Part Game',
            features: ['puzzle', 'images', 'completion'],
            helpText: 'Find the missing part of images'
        }
    },

    // Knowledge Base - Frequently Asked Questions
    knowledgeBase: {
        'what can you do': 'I can help you learn alphabet, numbers, animals, fruits, vegetables, play games, and answer your questions about KidBattle!',
        'how to play': 'Choose a game from the main page, select difficulty level, and start playing! I can guide you through any specific game.',
        'how to learn alphabet': 'Go to the Alphabet Learning section and click on any letter to see the letter, emoji, and word. You can also practice numbers!',
        'how to learn numbers': 'In the Alphabet Learning section, click the Numbers tab to practice counting from 1 to 100!',
        'what games are available': 'We have Brain Tug-of-War, Fruit Recognition, Animal Recognition, Color & Mood Game, Missing Part Game, and more!',
        'how to change difficulty': 'Before starting a game, select Easy, Medium, or Hard difficulty based on your skill level.',
        'what is brain tug': 'Brain Tug-of-War is a fun learning game where two teams compete by answering questions correctly!',
        'how to install app': 'Click the Install button or visit the /install page to add KidBattle to your home screen!',
        'what age is this for': 'KidBattle is designed for kids aged 2-8 years old, but anyone can enjoy learning!',
        'is it free': 'Yes! KidBattle is completely free to use for all kids.',
        'does it work offline': 'Yes! Once installed as a PWA, KidBattle works offline so you can learn anywhere.',
        'how to switch language': 'Currently we support English and Bengali. Some sections have both languages available.',
        'what animals can i learn': 'You can learn about many animals including dog, cat, lion, elephant, monkey, and more with sounds!',
        'what fruits can i learn': 'Learn about apple, banana, orange, grapes, watermelon, cherry, strawberry, mango, and many other fruits!',
        'what vegetables': 'Learn about carrot, tomato, cucumber, potato, and other healthy vegetables!',
        'cherry': 'Yes! Cherry 🍒 is a small, round, red fruit that is sweet and juicy! Cherries grow on trees and are delicious!',
        'strawberry': 'Strawberry 🍓 is a red, heart-shaped fruit with tiny seeds on the outside! So sweet and yummy!',
        'watermelon': 'Watermelon 🍉 is a big green fruit that is red and juicy inside! Perfect for summer!',
        'grapes': 'Grapes 🍇 are small, round fruits that grow in bunches! They can be purple, green, or red!',
        'mango': 'Mango 🥭 is a tropical fruit that is yellow and very sweet! It\'s called the king of fruits!',
        'pineapple': 'Pineapple 🍍 is a tropical fruit with a spiky outside and sweet yellow inside! Very tasty!',
        'red fruit': 'Red fruits include Apple 🍎, Cherry 🍒, Strawberry 🍓, Watermelon 🍉, and Tomato 🍅!',
        'yellow fruit': 'Yellow fruits include Banana 🍌, Mango 🥭, Pineapple 🍍, and Lemon 🍋!'
    },

    // System Prompt for AI
    systemPrompt: `You are KidBattle Chatbot, a friendly AI assistant for children aged 2-8 years old. 

Your role:
- Help kids learn alphabet, numbers, animals, fruits, vegetables, and more
- Guide users through educational games and activities
- Answer questions in simple, child-friendly language
- Use emojis to make responses fun and engaging
- Keep responses short (2-3 sentences maximum)
- Be encouraging and positive
- Avoid complex words or concepts

KidBattle Features:
- Alphabet Learning (A-Z, Bengali, Numbers, Multiplication)
- Fruit & Vegetable Learning with pictures
- Animal Learning with sounds
- Bird species learning
- Poem reading
- Brain Tug-of-War game
- Recognition games (upload & identify)
- Color & Mood themes
- Missing Part puzzle game

Always be helpful, patient, and make learning fun! 🎮📚✨`
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotConfig;
}
