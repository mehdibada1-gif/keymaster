'use server';

import { idVerification, IdVerificationInput } from '@/ai/flows/id-verification';
import { askQuestion, AskQuestionInput } from '@/ai/flows/faq-chatbot';
import { generateSpeech, GenerateSpeechInput } from '@/ai/flows/tts-flow';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Property, addProperty } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export async function verifyIdentityAction(
  input: IdVerificationInput
): Promise<{ success: boolean; data: any; error?: string }> {
  try {
    const result = await idVerification(input);
    // In a real app, you might want to parse the `verificationResult` string
    // to determine if it was a success or failure more concretely.
    // For now, we assume any result from the AI is a "success" at this layer.
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, data: null, error };
  }
}

export async function askQuestionAction(
  input: AskQuestionInput
): Promise<{ success: boolean; data: any; error?: string }> {
  try {
    const result = await askQuestion(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, data: null, error };
  }
}

export async function generateSpeechAction(
  input: GenerateSpeechInput
): Promise<{ success: boolean; data: any; error?: string }> {
  try {
    const result = await generateSpeech(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, data: null, error };
  }
}


export async function loginAction(prevState: any, formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectUrl = formData.get('redirect_url') as string;
  let loggedIn = false;

  // In a real app, you'd look up the user in a database.
  if (email === 'host@keymaster.com' && password === 'password123') {
    const session = { user: { email: 'host@keymaster.com', name: 'Host User' }, expires: Date.now() + 1000 * 60 * 60 * 24 };
    
    cookies().set('session', JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
    loggedIn = true;
  } else if (email === 'ozner@keymaster.com' && password === 'password123') {
    const session = { user: { email: 'ozner@keymaster.com', name: 'Ozner' }, expires: Date.now() + 1000 * 60 * 60 * 24 };
    
    cookies().set('session', JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
    loggedIn = true;
  }
  else {
    return { error: 'Invalid email or password' };
  }

  if (loggedIn) {
    if (redirectUrl) {
        redirect(redirectUrl);
    }
    redirect('/host/dashboard');
  }

  // This part should ideally not be reached if login is successful
  return { error: 'An unexpected error occurred.' };
}

export async function logoutAction() {
  cookies().delete('session');
  redirect('/host/login');
}

export async function createProperty(prevState: any, formData: FormData): Promise<{ success: boolean, error?: string }>{
  try {
    const newProperty: Omit<Property, 'id'> = {
        name: formData.get('name') as string,
        type: formData.get('type') as 'Apartment' | 'Riad' | 'Villa' | 'Cottage',
        address: formData.get('address') as string,
        imageUrl: formData.get('imageUrl') as string,
        imageHint: "custom property",
        googleMapsUrl: formData.get('googleMapsUrl') as string,
        checkin_instructions: {
            wifi: { 
                network: formData.get('wifi_network') as string,
                pass: formData.get('wifi_pass') as string,
            },
            door_code: formData.get('door_code') as string,
            rules: (formData.get('rules') as string).split('\n'),
        },
        contract_template: formData.get('contract_template') as string
    };
    await addProperty(newProperty);
    revalidatePath('/host/properties');
    return { success: true }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error };
  }
}
