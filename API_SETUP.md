# API Setup Instructions

## Current Configuration
Your chatbot now supports **3 different AI providers** that automatically switch when one has high demand:

1. **Google Gemini** (Currently Active)
2. **OpenAI GPT** (Backup)
3. **Anthropic Claude** (Backup)

## How to Get API Keys

### 1. Google Gemini (Already Configured)
- ✅ Already set up with your current key
- No additional setup needed

### 2. OpenAI GPT (Recommended Backup)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/Login to your account
3. Go to API Keys section
4. Create a new API key
5. Replace `sk-proj-your-openai-key-here` in script.js with your actual key

### 3. Anthropic Claude (Optional)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up/Login to your account
3. Go to API Keys section
4. Create a new API key
5. Replace `sk-ant-your-anthropic-key-here` in script.js with your actual key

## How It Works

1. **First Request**: Tries Google Gemini
2. **If Google Fails**: Automatically switches to OpenAI
3. **If OpenAI Fails**: Automatically switches to Anthropic
4. **If All Fail**: Uses intelligent offline responses
5. **Success**: Resets failure counters and continues

## Benefits

- ✅ **No More Errors**: Always gets responses
- ✅ **Automatic Switching**: Seamless API switching
- ✅ **High Availability**: Multiple backup providers
- ✅ **Cost Effective**: Only uses APIs when needed
- ✅ **Smart Fallback**: Offline responses when all APIs fail

## Quick Setup (Minimum Required)

Just add your OpenAI API key to get started:

```javascript
// In script.js, replace this line:
key: "sk-proj-your-openai-key-here",

// With your actual OpenAI key:
key: "sk-proj-abc123...",
```

That's it! Your chatbot will now automatically switch between Google and OpenAI when needed.
