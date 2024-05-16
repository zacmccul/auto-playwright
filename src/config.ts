export const MAX_TASK_CHARS = 2000;

import dotenv from 'dotenv'
import path from 'node:path';

dotenv.config({ path: path.basename(path.basename(__dirname)) + '/.env' });

console.log(`dotenv options: ${JSON.stringify(dotenv.config())}`)

export const AUTO_PLAYWRIGHT_DEBUG = process.env.AUTO_PLAYWRIGHT_DEBUG
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export const OPEN_AI_MODEL = process.env.OPEN_AI_MODEL ?? "gpt-3.5-turbo"

console.log(`OpenAI API Key: ${OPENAI_API_KEY}`)