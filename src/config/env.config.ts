import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
}));

export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-fcp',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret-change-me',
  expiration: process.env.JWT_EXPIRATION || '7d',
}));

export const aiConfig = registerAs('ai', () => ({
  provider: process.env.AI_PROVIDER || 'ollama',
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'qwen3',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
}));

export const corsConfig = registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
