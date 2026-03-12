# KidBattle AI-Powered Chatbot System 🤖

## Version 2.0 - Full AI Integration with Context Awareness

---

## Overview

The KidBattle Chatbot is a comprehensive AI-powered assistant system that helps children learn and navigate the KidBattle educational platform. It features:

- **AI Integration** (OpenAI/DeepSeek API support)
- **Context Awareness** (knows which page user is on)
- **Smart Caching** (faster responses for common questions)
- **Chat History** (localStorage database)
- **Knowledge Base** (pre-configured Q&A)
- **Rule-Based Fallback** (works without AI)
- **Multi-Source Responses** (cache → knowledge base → rules → AI → fallback)

---

## Architecture

### Files Structure

```
KidBattle/
├── chatbot.html          # Chatbot UI component
├── chatbot.css           # Chatbot styling
├── chatbot.js            # Original chatbot (legacy)
├── chatbot-config.js     # Configuration & settings
├── chatbot-ai.js         # AI-powered chatbot engine
└── README-CHATBOT.md     # This documentation
```

### System Flow

```
User Message
    ↓
1. Check Cache (fast lookup)
    ↓
2. Check Knowledge Base (pre-configured answers)
    ↓
3. Check Rule-Based System (pattern matching)
    ↓
4. Call AI API (if configured)
    ↓
5. Fallback Response (default)
    ↓
Save to Database (localStorage)
```

---

## Features

### ✅ Implemented Features

1. **AI Integration**
   - OpenAI API support
   - DeepSeek API support
   - Configurable model and parameters
   - Conversation history tracking

2. **Context Awareness**
   - Detects current page
   - Provides page-specific help
   - Adapts responses based on context

3. **Database System (localStorage)**
   - Chat logs storage
   - Conversation history
   - Response cache

4. **Smart Response System**
   - Multi-tier response hierarchy
   - Intelligent caching
   - Knowledge base integration
   - Rule-based fallback

5. **Analytics**
   - Message tracking
   - Response source logging
   - Context tracking

6. **Console API**
   - Configuration management
   - Data export
   - Statistics viewing
   - Cache management

---

## Configuration

### Basic Setup

The chatbot works out-of-the-box without AI. To enable AI features:

#### Option 1: Update chatbot-config.js

```javascript
const ChatbotConfig = {
    ai: {
        enabled: true,
        provider: 'openai', // or 'deepseek'
        apiKey: 'your-api-key-here',
        model: 'gpt-3.5-turbo',
        maxTokens: 150,
        temperature: 0.7
    }
};
```

#### Option 2: Set via Browser Console

```javascript
// Set API key
localStorage.setItem('chatbot_api_key', 'sk-your-api-key');

// Or use the console API
KidBattleChatbot.setApiKey('sk-your-api-key');
```

### Configuration Options

```javascript
{
    // AI Settings
    ai: {
        enabled: true/false,
        provider: 'openai' | 'deepseek',
        apiKey: 'your-key',
        model: 'gpt-3.5-turbo',
        maxTokens: 150,
        temperature: 0.7
    },

    // Feature Flags
    features: {
        aiEnabled: true,
        contextAware: true,
        chatHistory: true,
        autoSuggestions: true,
        typingIndicator: true,
        analytics: true
    },

    // Cache Settings
    cache: {
        enabled: true,
        maxEntries: 100,
        ttl: 3600000 // 1 hour
    },

    // Storage Settings
    storage: {
        chatLogsKey: 'kidbattle_chat_logs',
        maxLogs: 500,
        maxConversationLength: 50
    }
}
```

---

## API Reference

### Console API

The chatbot exposes a global API via `window.KidBattleChatbot`:

```javascript
// Set or update API key
KidBattleChatbot.setApiKey('your-key');

// Get chatbot statistics
KidBattleChatbot.getStats();
// Returns: {
//   messages: 42,
//   cached: 15,
//   conversation: 30,
//   context: {...},
//   aiConfigured: true
// }

// Clear conversation history
KidBattleChatbot.clearHistory();

// Clear response cache
KidBattleChatbot.clearCache();

// Get all chat logs
KidBattleChatbot.getLogs();

// Export all data (for backup/analysis)
KidBattleChatbot.exportData();
```

---

## Database Schema (localStorage)

### Chat Logs

```javascript
{
    id: 1710234567890,
    user_message: "Hello",
    bot_response: "Hello! I'm KidBattle Chatbot...",
    timestamp: "2026-03-12T10:30:00.000Z",
    context: { page: "home", title: "Home Page" },
    page: "/index.html"
}
```

### Conversation History

```javascript
[
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Hello! I'm KidBattle..." },
    { role: "user", content: "How do I play games?" },
    { role: "assistant", content: "Choose a game from..." }
]
```

### Response Cache

```javascript
{
    "hello": {
        response: "Hello! I'm KidBattle Chatbot...",
        timestamp: 1710234567890
    }
}
```

---

## Context System

The chatbot automatically detects which page/section the user is on:

### Supported Contexts

- **Home Page** - General navigation help
- **Alphabet Learning** - Letter and phonics help
- **Fruit Learning** - Fruit names and information
- **Vegetable Learning** - Vegetable information
- **Animal Learning** - Animal sounds and names
- **Bird Learning** - Bird species information
- **Poem Learning** - Poetry and rhymes
- **Brain Tug Game** - Game instructions
- **Recognition Game** - Upload and identify help
- **Color & Mood** - Color and theme help
- **Missing Part** - Puzzle game help

### Context Detection

The system uses URL path and hash to detect context:

```javascript
// Examples:
index.html#learn-alphabet  → Alphabet Learning context
index.html#fruit-learning  → Fruit Learning context
index.html#game-difficulty → Game context
```

---

## Knowledge Base

Pre-configured Q&A pairs in `chatbot-config.js`:

```javascript
knowledgeBase: {
    'what can you do': 'I can help you learn alphabet...',
    'how to play': 'Choose a game from the main page...',
    'how to learn alphabet': 'Go to the Alphabet Learning...',
    // ... 15+ more entries
}
```

To add custom knowledge:

1. Open `chatbot-config.js`
2. Add entries to `knowledgeBase` object
3. Use lowercase keys for pattern matching

---

## AI Integration Guide

### OpenAI Setup

1. Get API key from https://platform.openai.com/api-keys
2. Configure in chatbot-config.js or console:

```javascript
ChatbotConfig.ai.provider = 'openai';
ChatbotConfig.ai.apiKey = 'sk-...';
ChatbotConfig.ai.model = 'gpt-3.5-turbo';
```

### DeepSeek Setup

1. Get API key from DeepSeek platform
2. Configure:

```javascript
ChatbotConfig.ai.provider = 'deepseek';
ChatbotConfig.ai.apiKey = 'your-deepseek-key';
ChatbotConfig.ai.model = 'deepseek-chat';
```

### Custom AI Provider

To add a new AI provider:

1. Add endpoint to `chatbot-config.js`:

```javascript
ai: {
    endpoints: {
        openai: 'https://api.openai.com/v1/chat/completions',
        deepseek: 'https://api.deepseek.com/v1/chat/completions',
        custom: 'https://your-api.com/v1/chat'
    }
}
```

2. Update `AIManager.callAI()` in `chatbot-ai.js` if needed

---

## Response Hierarchy

The chatbot checks multiple sources in order:

1. **Cache** (instant) - Previously answered questions
2. **Knowledge Base** (fast) - Pre-configured Q&A pairs
3. **Rules** (fast) - Pattern matching logic
4. **AI API** (slow) - External AI service
5. **Fallback** (instant) - Default responses

### Response Times

- Cache: < 10ms
- Knowledge Base: < 20ms
- Rules: < 50ms
- AI API: 500-2000ms (depends on API)
- Fallback: < 5ms

---

## Performance Optimization

### Caching Strategy

- Responses cached by lowercase message
- TTL: 1 hour (configurable)
- Max entries: 100 (configurable)
- Automatic cache cleanup

### Conversation History

- Last 50 messages saved (configurable)
- Sent to AI for context
- Persists across sessions

### Database Limits

- Max chat logs: 500 entries
- Oldest entries removed automatically
- Efficient localStorage usage

---

## Security

### Input Sanitization

User inputs are trimmed and limited:
- Max length: 200 characters
- No HTML injection
- Safe DOM insertion

### API Key Storage

- Stored in localStorage
- Not exposed in HTML
- Configurable via console only

### Rate Limiting

- Built-in processing lock
- Prevents spam
- One message at a time

---

## Analytics

### Tracked Metrics

```javascript
{
    timestamp: "2026-03-12T10:30:00.000Z",
    message: "How do I play?",
    responseSource: "knowledge_base",
    context: "home",
    messageCount: 42
}
```

### Export Data

```javascript
const data = KidBattleChatbot.exportData();
// Download or send to analytics service
console.log(data);
```

---

## Troubleshooting

### Chatbot Not Visible

**Issue:** Floating button doesn't appear

**Solutions:**
1. Check browser console for errors
2. Verify `chatbot-config.js` and `chatbot-ai.js` loaded
3. Clear cache and reload
4. Check if `#kidbattle-chatbot` element exists in HTML

### AI Not Working

**Issue:** Responses don't use AI

**Solutions:**
1. Verify API key is set:
   ```javascript
   console.log(localStorage.getItem('chatbot_api_key'));
   ```
2. Check configuration:
   ```javascript
   console.log(KidBattleChatbot.getStats().aiConfigured);
   ```
3. Check browser console for API errors
4. Verify API key is valid and has credits
5. Check network tab for failed requests

### Slow Responses

**Issue:** Chatbot takes too long to respond

**Solutions:**
1. Enable caching: `ChatbotConfig.cache.enabled = true`
2. Add more knowledge base entries
3. Use faster AI model (gpt-3.5-turbo vs gpt-4)
4. Reduce maxTokens in config
5. Check internet connection

### localStorage full

**Issue:** "QuotaExceededError"

**Solutions:**
```javascript
// Clear old data
KidBattleChatbot.clearHistory();
KidBattleChatbot.clearCache();

// Or reduce limits in config
ChatbotConfig.storage.maxLogs = 100;
ChatbotConfig.cache.maxEntries = 50;
```

---

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Required Features

- localStorage
- Fetch API
- ES6 JavaScript
- CSS Grid/Flexbox

---

## Future Enhancements

### Planned Features

- [ ] Voice input/output
- [ ] Multi-language support (Bengali UI)
- [ ] Image recognition integration
- [ ] Backend API integration (when available)
- [ ] Real database (when server added)
- [ ] Admin panel for managing responses
- [ ] User authentication
- [ ] Chat export (PDF/JSON)
- [ ] Emotion detection
- [ ] Personalized learning paths

### Optional Backend Integration

When you add a backend server, you can:

1. Create API endpoints:
   - `POST /api/chatbot/message`
   - `GET /api/chatbot/logs`
   - `GET /api/chatbot/analytics`

2. Replace localStorage with database:
   - PostgreSQL
   - MongoDB
   - Firebase

3. Add authentication:
   - Track per-user conversations
   - Personalized responses

---

## Support

### Getting Help

1. Check browser console for errors
2. Review configuration in `chatbot-config.js`
3. Test with: `KidBattleChatbot.getStats()`
4. Export logs: `KidBattleChatbot.getLogs()`

### Debug Mode

Enable verbose logging:

```javascript
// In browser console
localStorage.setItem('chatbot_debug', 'true');
location.reload();
```

---

## License

Part of the KidBattle educational platform.

---

## Credits

- **Version:** 2.0
- **Built for:** KidBattle Learning Platform
- **Features:** AI Integration, Context Awareness, Smart Caching
- **Framework:** Vanilla JavaScript (no dependencies)

---

**Happy Learning! 🎮📚✨**
