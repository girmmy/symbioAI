# Symbio AI

TSA Software Development Event 2024-2025

Access web app here: [symbioai.netlify.app](https://symbioai.netlify.app/)

## Setup Instructions

### 1. Environment Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your actual API keys:
   ```env
   VITE_API_KEY=your_actual_openai_api_key_here
   VITE_CARBON=your_carbon_assistant_id_here
   VITE_RECYCLING=your_recycling_assistant_id_here
   VITE_ELECTRICITY=your_electricity_assistant_id_here
   VITE_WATER=your_water_assistant_id_here
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

## Security Notes

- **Never commit your `.env` file** - it contains sensitive API keys
- The `.env` file is already included in `.gitignore`
- Use `.env.example` as a template for required environment variables
- If you suspect your API key was leaked, regenerate it immediately in your OpenAI dashboard

## Features

- **Parallel Thread Initialization**: Fast startup with concurrent thread creation
- **Error Handling**: Graceful error handling with retry functionality
- **Responsive UI**: Disabled inputs until threads are ready
- **Multiple AI Assistants**: Specialized assistants for different sustainability topics
