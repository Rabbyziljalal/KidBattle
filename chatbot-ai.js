/* ===== KIDBATTLE AI-POWERED CHATBOT SYSTEM ===== */
/* Version: 2.0 - Full AI Integration with Context Awareness & Database */

(function() {
    'use strict';

    // Load configuration
    const config = typeof ChatbotConfig !== 'undefined' ? ChatbotConfig : getDefaultConfig();

    // Chatbot State
    const state = {
        conversationHistory: [],
        currentContext: null,
        messageCount: 0,
        isProcessing: false,
        cache: new Map(),
        apiKey: null
    };

    // Database Manager (localStorage)
    const Database = {
        // Save chat log
        saveChatLog(userMessage, botResponse) {
            try {
                const logs = this.getChatLogs();
                logs.push({
                    id: Date.now(),
                    user_message: userMessage,
                    bot_response: botResponse,
                    timestamp: new Date().toISOString(),
                    context: state.currentContext,
                    page: window.location.pathname
                });

                // Keep only last N logs
                if (logs.length > config.storage.maxLogs) {
                    logs.shift();
                }

                localStorage.setItem(config.storage.chatLogsKey, JSON.stringify(logs));
            } catch (error) {
                console.warn('Error saving chat log:', error);
            }
        },

        // Get all chat logs
        getChatLogs() {
            try {
                const logs = localStorage.getItem(config.storage.chatLogsKey);
                return logs ? JSON.parse(logs) : [];
            } catch (error) {
                return [];
            }
        },

        // Save conversation history
        saveConversation() {
            try {
                const history = state.conversationHistory.slice(-config.storage.maxConversationLength);
                localStorage.setItem(config.storage.conversationKey, JSON.stringify(history));
            } catch (error) {
                console.warn('Error saving conversation:', error);
            }
        },

        // Load conversation history
        loadConversation() {
            try {
                const history = localStorage.getItem(config.storage.conversationKey);
                return history ? JSON.parse(history) : [];
            } catch (error) {
                return [];
            }
        },

        // Save cache
        saveCache() {
            try {
                const cacheObj = Object.fromEntries(state.cache);
                localStorage.setItem(config.storage.cacheKey, JSON.stringify(cacheObj));
            } catch (error) {
                console.warn('Error saving cache:', error);
            }
        },

        // Load cache
        loadCache() {
            try {
                const cacheData = localStorage.getItem(config.storage.cacheKey);
                if (cacheData) {
                    const cacheObj = JSON.parse(cacheData);
                    state.cache = new Map(Object.entries(cacheObj));
                }
            } catch (error) {
                console.warn('Error loading cache:', error);
            }
        },

        // Clear old cache entries
        cleanCache() {
            const now = Date.now();
            for (const [key, value] of state.cache.entries()) {
                if (now - value.timestamp > config.cache.ttl) {
                    state.cache.delete(key);
                }
            }
            this.saveCache();
        }
    };

    // Context Manager
    const ContextManager = {
        // Detect current page context
        detectContext() {
            const path = window.location.pathname;
            const hash = window.location.hash;
            
            // Check URL path and hash for context clues
            if (path.includes('index.html') || path === '/' || path === '') {
                if (hash.includes('alphabet') || hash.includes('learn-alphabet')) {
                    return config.contexts.alphabet || config.contexts['index.html'];
                } else if (hash.includes('fruit')) {
                    return config.contexts.fruit || config.contexts['index.html'];
                } else if (hash.includes('vegetable')) {
                    return config.contexts.vegetable || config.contexts['index.html'];
                } else if (hash.includes('animal')) {
                    return config.contexts.animal || config.contexts['index.html'];
                } else if (hash.includes('bird')) {
                    return config.contexts.bird || config.contexts['index.html'];
                } else if (hash.includes('poem')) {
                    return config.contexts.poem || config.contexts['index.html'];
                } else if (hash.includes('game') || hash.includes('difficulty')) {
                    return config.contexts.game || config.contexts['index.html'];
                } else if (hash.includes('recognition')) {
                    return config.contexts.recognition || config.contexts['index.html'];
                } else if (hash.includes('color') || hash.includes('mood')) {
                    return config.contexts.color || config.contexts['index.html'];
                } else if (hash.includes('missing')) {
                    return config.contexts.missing || config.contexts['index.html'];
                }
                return config.contexts['index.html'];
            }
            
            // Fallback to default context
            return config.contexts['index.html'] || { page: 'unknown', title: 'KidBattle' };
        },

        // Update context
        updateContext() {
            state.currentContext = this.detectContext();
            console.log('Context updated:', state.currentContext);
        },

        // Get context-aware system message
        getContextMessage() {
            if (!state.currentContext) return '';
            
            return `Current page: ${state.currentContext.title}. ${state.currentContext.helpText}`;
        }
    };

    // AI Integration Manager
    const AIManager = {
        // Check if AI is configured
        isConfigured() {
            if (!config.features.aiEnabled) return false;
            
            // Check for API key in config or localStorage
            state.apiKey = config.ai.apiKey || localStorage.getItem('chatbot_api_key');
            return !!state.apiKey;
        },

        // Get API endpoint
        getEndpoint() {
            return config.ai.endpoints[config.ai.provider] || config.ai.endpoints.openai;
        },

        // Build AI request payload
        buildPayload(userMessage) {
            const messages = [
                {
                    role: 'system',
                    content: config.systemPrompt + '\n\n' + ContextManager.getContextMessage()
                }
            ];

            // Add conversation history (last 10 messages)
            const recentHistory = state.conversationHistory.slice(-10);
            messages.push(...recentHistory);

            // Add current user message
            messages.push({
                role: 'user',
                content: userMessage
            });

            return {
                model: config.ai.model,
                messages: messages,
                max_tokens: config.ai.maxTokens,
                temperature: config.ai.temperature
            };
        },

        // Call AI API
        async callAI(userMessage) {
            if (!this.isConfigured()) {
                return {
                    success: false,
                    error: 'AI not configured. Please add API key.'
                };
            }

            try {
                const response = await fetch(this.getEndpoint(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.apiKey}`
                    },
                    body: JSON.stringify(this.buildPayload(userMessage))
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                const aiResponse = data.choices[0].message.content;

                // Update conversation history
                state.conversationHistory.push(
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: aiResponse }
                );

                Database.saveConversation();

                return {
                    success: true,
                    response: aiResponse,
                    source: 'ai'
                };
            } catch (error) {
                console.error('AI API Error:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    };

    // Response Manager
    const ResponseManager = {
        // Check cache first
        getCachedResponse(message) {
            if (!config.cache.enabled) return null;

            const key = message.toLowerCase().trim();
            const cached = state.cache.get(key);

            if (cached && Date.now() - cached.timestamp < config.cache.ttl) {
                return cached.response;
            }

            return null;
        },

        // Save response to cache
        cacheResponse(message, response) {
            if (!config.cache.enabled) return;

            const key = message.toLowerCase().trim();
            state.cache.set(key, {
                response: response,
                timestamp: Date.now()
            });

            // Limit cache size
            if (state.cache.size > config.cache.maxEntries) {
                const firstKey = state.cache.keys().next().value;
                state.cache.delete(firstKey);
            }

            Database.saveCache();
        },

        // Check knowledge base
        checkKnowledgeBase(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            for (const [question, answer] of Object.entries(config.knowledgeBase)) {
                if (lowerMessage.includes(question) || question.includes(lowerMessage)) {
                    return answer;
                }
            }

            return null;
        },

        // Get rule-based response (original logic)
        getRuleBasedResponse(message) {
            const lowerMessage = message.toLowerCase().trim();

            // Greetings
            if (/^(hi|hello|hey|hola|namaste|assalamu alaikum|salam)$/i.test(lowerMessage)) {
                return "Hello! I'm KidBattle Chatbot 🤖. How can I help you today?";
            }

            // Help
            if (lowerMessage.includes('help') || lowerMessage === '?') {
                const contextHelp = state.currentContext ? `\n\nYou're currently on the ${state.currentContext.title} page. ${state.currentContext.helpText}` : '';
                return "I can help you with:\n🔤 Learning Alphabet\n🔢 Learning Numbers\n🎮 Playing Games\n🐱 Learning Animals\n🍎 Learning Fruits\n🌈 Colors & More!" + contextHelp;
            }

            // Context-aware responses
            if (state.currentContext) {
                if (state.currentContext.page === 'alphabet' && (lowerMessage.includes('alphabet') || lowerMessage.includes('letter'))) {
                    return "You're in Alphabet Learning! 📚\nClick any letter to see it, hear it, and learn a word. Try the Bengali tab for Bengali alphabet, or Numbers tab for counting!";
                }
                
                if (state.currentContext.page === 'game' && (lowerMessage.includes('game') || lowerMessage.includes('play'))) {
                    return "You're in the Brain Tug-of-War game! 🎮\nSelect your difficulty (Easy, Medium, Hard) and start playing. Answer questions correctly to pull the rope and win!";
                }
            }

            // Alphabet
            if (lowerMessage.includes('alphabet') || lowerMessage.includes('abc') || lowerMessage.includes('letter')) {
                return "Let's learn ABC! 📚\nA for Apple 🍎\nB for Ball ⚽\nC for Cat 🐱\nGo to 'Learn Alphabet' to practice all letters!";
            }

            // Numbers
            if (lowerMessage.includes('number') || lowerMessage.includes('counting') || lowerMessage.includes('count') || /\d/.test(lowerMessage)) {
                return "Let's count together! 🔢\n1, 2, 3, 4, 5... \nNumbers are fun! Go to 'Learn Alphabet' section and select 'Numbers' tab to practice counting from 1 to 100!";
            }

            // Games
            if (lowerMessage.includes('game') || lowerMessage.includes('play') || lowerMessage.includes('fun')) {
                return "You can play fun learning games in KidBattle! 🎮\n• Brain Tug-of-War 🧠\n• Animal Sounds 🐶\n• Fruit & Vegetable Learning 🍎\n• Color & Recognition Games 🌈\nChoose a game and start playing!";
            }

            // Animals
            if (lowerMessage.includes('animal') || lowerMessage.includes('dog') || lowerMessage.includes('cat') || lowerMessage.includes('lion') || lowerMessage.includes('elephant')) {
                return "Let's learn about animals! 🐾\n🐶 Dog says Woof!\n🐱 Cat says Meow!\n🦁 Lion says Roar!\n🐘 Elephant makes a trumpet sound!\nExplore more in Animal Theme!";
            }

            // Fruits
            if (lowerMessage.includes('fruit') || lowerMessage.includes('apple') || lowerMessage.includes('banana') || lowerMessage.includes('orange')) {
                return "Fruits are yummy and healthy! 🍎\n🍎 Apple - Red and crunchy!\n🍌 Banana - Yellow and sweet!\n🍊 Orange - Juicy and fresh!\nLearn more fruits in our learning section!";
            }

            // Vegetables
            if (lowerMessage.includes('vegetable') || lowerMessage.includes('carrot') || lowerMessage.includes('tomato')) {
                return "Vegetables keep us strong! 🥕\n🥕 Carrot - Orange and healthy!\n🍅 Tomato - Red and tasty!\n🥒 Cucumber - Green and fresh!\nExplore vegetables in learning mode!";
            }

            // Colors
            if (lowerMessage.includes('color') || lowerMessage.includes('colour') || lowerMessage.includes('red') || lowerMessage.includes('blue') || lowerMessage.includes('yellow')) {
                return "Colors make the world beautiful! 🌈\n❤️ Red\n💙 Blue\n💛 Yellow\n💚 Green\n🧡 Orange\n💜 Purple\nLearn colors in our Color & Mood Game!";
            }

            // Birds
            if (lowerMessage.includes('bird') || lowerMessage.includes('parrot') || lowerMessage.includes('peacock') || lowerMessage.includes('crow')) {
                return "Birds can fly high in the sky! 🐦\n🦜 Parrot - Colorful and talks!\n🦚 Peacock - Beautiful feathers!\n🦅 Eagle - Strong and brave!\nLearn more about birds!";
            }

            // Poems
            if (lowerMessage.includes('poem') || lowerMessage.includes('rhyme') || lowerMessage.includes('song')) {
                return "Poems are fun to learn! 📖✨\nWe have many beautiful poems for kids.\nGo to 'Learn Poems' to read and enjoy rhymes!";
            }

            // Math
            if (lowerMessage.includes('math') || lowerMessage.includes('plus') || lowerMessage.includes('minus') || lowerMessage.includes('multiply') || lowerMessage.includes('add') || lowerMessage.includes('subtract')) {
                return "Math is fun! ➕➖✖️➗\nYou can practice:\n• Addition (+)\n• Subtraction (-)\n• Multiplication (×)\n• Division (÷)\nPlay Brain Tug-of-War to practice math!";
            }

            // Thank you
            if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
                return "You're welcome! 😊 Keep learning and having fun!";
            }

            // Goodbye
            if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you')) {
                return "Goodbye! 👋 Come back soon to learn more fun things!";
            }

            // Name questions
            if (lowerMessage.includes('your name') || lowerMessage.includes('who are you')) {
                return "I'm KidBattle Chatbot! 🤖 I'm here to help kids learn and play. What's your name?";
            }

            // Age questions
            if (lowerMessage.includes('how old') || lowerMessage.includes('your age')) {
                return "I'm a chatbot, so I don't have an age! But I'm always here to help you learn! 🤖✨";
            }

            // Learning
            if (lowerMessage.includes('learn') || lowerMessage.includes('teach') || lowerMessage.includes('study')) {
                return "Learning is fun! 📚✨\nYou can learn:\n🔤 Alphabet\n🔢 Numbers\n🐾 Animals\n🍎 Fruits & Vegetables\n🌈 Colors\n📖 Poems\nWhat would you like to learn today?";
            }

            return null;
        },

        // Get intelligent response
        async getResponse(userMessage) {
            // 1. Check cache
            const cachedResponse = this.getCachedResponse(userMessage);
            if (cachedResponse) {
                console.log('Response from cache');
                return { text: cachedResponse, source: 'cache' };
            }

            // 2. Check knowledge base
            const kbResponse = this.checkKnowledgeBase(userMessage);
            if (kbResponse) {
                this.cacheResponse(userMessage, kbResponse);
                console.log('Response from knowledge base');
                return { text: kbResponse, source: 'knowledge_base' };
            }

            // 3. Check rule-based system
            const ruleResponse = this.getRuleBasedResponse(userMessage);
            if (ruleResponse) {
                this.cacheResponse(userMessage, ruleResponse);
                console.log('Response from rules');
                return { text: ruleResponse, source: 'rules' };
            }

            // 4. Try AI if configured
            if (AIManager.isConfigured()) {
                const aiResult = await AIManager.callAI(userMessage);
                if (aiResult.success) {
                    this.cacheResponse(userMessage, aiResult.response);
                    console.log('Response from AI');
                    return { text: aiResult.response, source: 'ai' };
                }
            }

            // 5. Default fallback
            const fallbacks = [
                "That's interesting! Can you ask about Alphabet, Numbers, Games, or Animals? 🤔",
                "I'm still learning! Try asking about learning topics or games! 🎮",
                "Hmm, I'm not sure about that. Ask me about colors, animals, or numbers! 🌟",
                "I love helping kids! Ask me about ABC, 123, or fun games! 🎨"
            ];
            
            const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            return { text: fallback, source: 'fallback' };
        }
    };

    // Main Chatbot Initialization
    function initChatbot() {
        // Get chatbot elements
        const toggleBtn = document.getElementById('chatbot-toggle-btn');
        const closeBtn = document.getElementById('chatbot-close-btn');
        const chatWindow = document.getElementById('chatbot-window');
        const messagesContainer = document.getElementById('chatbot-messages');
        const inputField = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send-btn');

        if (!toggleBtn || !chatWindow) {
            console.warn('Chatbot elements not found');
            return;
        }

        // Initialize
        initialize();

        // Toggle chatbot window
        toggleBtn.addEventListener('click', () => {
            const isActive = chatWindow.classList.toggle('active');
            toggleBtn.classList.toggle('active', isActive);
            
            if (isActive) {
                inputField.focus();
                ContextManager.updateContext();
            }
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active');
            toggleBtn.classList.remove('active');
        });

        // Send message on button click
        sendBtn.addEventListener('click', handleSendMessage);

        // Send message on Enter key
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !state.isProcessing) {
                handleSendMessage();
            }
        });

        // Handle quick suggestion buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const message = e.target.getAttribute('data-message');
                if (message) {
                    handleUserMessage(message);
                }
            }
        });

        // Update context when hash changes
        window.addEventListener('hashchange', () => {
            ContextManager.updateContext();
        });

        // Send message handler
        async function handleSendMessage() {
            const message = inputField.value.trim();
            if (message && !state.isProcessing) {
                await handleUserMessage(message);
                inputField.value = '';
            }
        }

        // Handle user message
        async function handleUserMessage(message) {
            if (state.isProcessing) return;

            state.isProcessing = true;
            state.messageCount++;

            // Display user message
            addMessage(message, 'user');

            // Show typing indicator
            showTypingIndicator();

            // Get response
            const delay = config.ui.messageDelay + Math.random() * 400;
            
            try {
                const response = await ResponseManager.getResponse(message);
                
                setTimeout(() => {
                    hideTypingIndicator();
                    addMessage(response.text, 'bot');
                    
                    // Save to database
                    Database.saveChatLog(message, response.text);
                    
                    // Analytics
                    if (config.features.analytics) {
                        logAnalytics(message, response);
                    }
                    
                    state.isProcessing = false;
                }, delay);
            } catch (error) {
                console.error('Error getting response:', error);
                setTimeout(() => {
                    hideTypingIndicator();
                    addMessage("Oops! Something went wrong. Please try again! 😊", 'bot');
                    state.isProcessing = false;
                }, delay);
            }
        }

        // Add message to chat
        function addMessage(content, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${type}-message`;

            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = type === 'bot' ? '🤖' : '👦';

            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';

            // Handle multiple paragraphs or single message
            if (Array.isArray(content)) {
                content.forEach(text => {
                    const p = document.createElement('p');
                    p.textContent = text;
                    bubble.appendChild(p);
                });
            } else {
                // Split by newlines and create paragraphs
                const lines = content.split('\n').filter(line => line.trim());
                lines.forEach(line => {
                    const p = document.createElement('p');
                    p.textContent = line;
                    bubble.appendChild(p);
                });
            }

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(bubble);

            messagesContainer.appendChild(messageDiv);
            
            if (config.ui.autoScroll) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }

        // Show typing indicator
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chatbot-message typing-indicator';

            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = '🤖';

            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';

            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('div');
                dot.className = 'typing-dot';
                bubble.appendChild(dot);
            }

            typingDiv.appendChild(avatar);
            typingDiv.appendChild(bubble);

            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Hide typing indicator
        function hideTypingIndicator() {
            const typingIndicator = messagesContainer.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        // Initialize system
        function initialize() {
            // Load cache and conversation
            Database.loadCache();
            state.conversationHistory = Database.loadConversation();
            
            // Clean old cache
            Database.cleanCache();
            
            // Detect initial context
            ContextManager.updateContext();
            
            // Check AI configuration
            if (config.features.aiEnabled && !AIManager.isConfigured()) {
                console.warn('AI is enabled but not configured. Set API key: localStorage.setItem("chatbot_api_key", "your-key")');
            }
            
            // Auto-show chatbot on first visit (optional)
            const hasSeenChatbot = localStorage.getItem('kidbattle_chatbot_seen');
            if (!hasSeenChatbot && config.features.autoSuggestions) {
                setTimeout(() => {
                    toggleBtn.click();
                    localStorage.setItem('kidbattle_chatbot_seen', 'true');
                }, 3000);
            }
            
            console.log('KidBattle Chatbot initialized', {
                version: '2.0',
                aiEnabled: AIManager.isConfigured(),
                context: state.currentContext,
                cachedResponses: state.cache.size,
                conversationLength: state.conversationHistory.length
            });
        }

        // Analytics logging
        function logAnalytics(userMessage, response) {
            const analyticsData = {
                timestamp: new Date().toISOString(),
                message: userMessage,
                responseSource: response.source,
                context: state.currentContext?.page,
                messageCount: state.messageCount
            };
            
            // Could send to analytics service here
            console.log('Analytics:', analyticsData);
        }
    }

    // Default configuration fallback
    function getDefaultConfig() {
        return {
            features: {
                aiEnabled: false,
                contextAware: true,
                chatHistory: true
            },
            cache: {
                enabled: true,
                maxEntries: 100,
                ttl: 3600000
            },
            storage: {
                chatLogsKey: 'kidbattle_chat_logs',
                conversationKey: 'kidbattle_conversation',
                cacheKey: 'kidbattle_chat_cache',
                maxLogs: 500,
                maxConversationLength: 50
            },
            ui: {
                autoScroll: true,
                messageDelay: 800
            },
            contexts: {
                'index.html': { page: 'home', title: 'Home Page' }
            },
            knowledgeBase: {},
            systemPrompt: 'You are a helpful assistant for kids.'
        };
    }

    // Expose API for console management
    window.KidBattleChatbot = {
        version: '2.0',
        setApiKey: (key) => {
            localStorage.setItem('chatbot_api_key', key);
            state.apiKey = key;
            console.log('API key updated');
        },
        getStats: () => ({
            messages: state.messageCount,
            cached: state.cache.size,
            conversation: state.conversationHistory.length,
            context: state.currentContext,
            aiConfigured: AIManager.isConfigured()
        }),
        clearHistory: () => {
            localStorage.removeItem(config.storage.chatLogsKey);
            localStorage.removeItem(config.storage.conversationKey);
            state.conversationHistory = [];
            console.log('History cleared');
        },
        clearCache: () => {
            localStorage.removeItem(config.storage.cacheKey);
            state.cache.clear();
            console.log('Cache cleared');
        },
        getLogs: () => Database.getChatLogs(),
        exportData: () => ({
            logs: Database.getChatLogs(),
            conversation: state.conversationHistory,
            cache: Object.fromEntries(state.cache)
        })
    };

})();
