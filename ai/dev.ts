'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/id-verification.ts';
import '@/ai/flows/tts-flow.ts';
import '@/ai/flows/faq-chatbot.ts';
