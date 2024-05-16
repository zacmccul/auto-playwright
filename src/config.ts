export const MAX_TASK_CHARS = 2000;

import dotenv from 'dotenv'
import path from 'node:path';

dotenv.config({ path: path.basename(path.basename(__dirname)) + '/.env' });

console.log(`dotenv options: ${JSON.stringify(dotenv.config())}`)

export const AUTO_PLAYWRIGHT_DEBUG = process.env.AUTO_PLAYWRIGHT_DEBUG
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-3.5-turbo"
export const AUTO_PLAYWRIGHT_MODEL_URL = process.env.AUTO_PLAYWRIGHT_MODEL_URL
export const OPENAI_API_VERSION = process.env.OPENAI_API_VERSION

console.log(`OpenAI API Key: ${OPENAI_API_KEY}`)