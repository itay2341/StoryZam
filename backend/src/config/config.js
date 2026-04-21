import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  
  acrcloud: {
    host: process.env.ACRCLOUD_HOST,
    accessKey: process.env.ACRCLOUD_ACCESS_KEY,
    accessSecret: process.env.ACRCLOUD_ACCESS_SECRET,
  },
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};

// Validate required environment variables
export function validateConfig() {
  const required = [
    'ACRCLOUD_HOST',
    'ACRCLOUD_ACCESS_KEY',
    'ACRCLOUD_ACCESS_SECRET',
    'GEMINI_API_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
