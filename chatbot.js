/* ===== KIDBATTLE CHATBOT JAVASCRIPT ===== */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

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

        // Toggle chatbot window
        toggleBtn.addEventListener('click', () => {
            const isActive = chatWindow.classList.toggle('active');
            toggleBtn.classList.toggle('active', isActive);
            
            if (isActive) {
                inputField.focus();
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
            if (e.key === 'Enter') {
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

        // Send message handler
        function handleSendMessage() {
            const message = inputField.value.trim();
            if (message) {
                handleUserMessage(message);
                inputField.value = '';
            }
        }

        // Handle user message
        function handleUserMessage(message) {
            // Display user message
            addMessage(message, 'user');

            // Show typing indicator
            showTypingIndicator();

            // Get bot response after a short delay
            setTimeout(() => {
                hideTypingIndicator();
                const response = getBotResponse(message);
                addMessage(response, 'bot');
            }, 800 + Math.random() * 400); // Random delay 800-1200ms
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
                const p = document.createElement('p');
                p.textContent = content;
                bubble.appendChild(p);
            }

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(bubble);

            // Remove typing indicator if exists
            const typingIndicator = messagesContainer.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
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

        // Get bot response based on user message (Rule-based system)
        function getBotResponse(message) {
            const lowerMessage = message.toLowerCase().trim();

            // Greetings
            if (/^(hi|hello|hey|hola|namaste|assalamu alaikum|salam)$/i.test(lowerMessage)) {
                return "Hello! I'm KidBattle Chatbot 🤖. How can I help you today?";
            }

            // Help
            if (lowerMessage.includes('help') || lowerMessage === '?') {
                return "I can help you with:\n🔤 Learning Alphabet\n🔢 Learning Numbers\n🎮 Playing Games\n🐱 Learning Animals\n🍎 Learning Fruits\n🌈 Colors & More!\nJust ask me anything!";
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

            // Default response
            const defaultResponses = [
                "That's interesting! Tell me more! 😊",
                "I'm still learning! Can you ask about Alphabet, Numbers, Games, or Animals? 🤔",
                "Hmm, I'm not sure about that. Try asking about learning or games! 🎮",
                "I love helping kids! Ask me about ABC, 123, or fun games! 🌟",
                "That's a great question! I'm best at helping with learning topics. Try asking about colors, animals, or numbers! 🎨"
            ];

            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        // Auto-show chatbot on first visit (optional)
        const hasSeenChatbot = localStorage.getItem('kidbattle_chatbot_seen');
        if (!hasSeenChatbot) {
            setTimeout(() => {
                toggleBtn.click();
                localStorage.setItem('kidbattle_chatbot_seen', 'true');
            }, 3000); // Show after 3 seconds on first visit
        }
    }
})();
