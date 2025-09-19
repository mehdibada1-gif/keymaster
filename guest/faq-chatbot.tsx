'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Loader2, User, Sparkles, Volume2, Mic } from 'lucide-react';
import { askQuestionAction, generateSpeechAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Reservation } from '@/lib/data';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


type FaqChatbotProps = {
  propertyId: string;
  reservation: Reservation;
};

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export function FaqChatbot({ propertyId, reservation }: FaqChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState<number | null>(null);
  const [micState, setMicState] = useState<'idle' | 'listening' | 'recognizing'>('idle');
  const [mounted, setMounted] = useState(false);
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if SpeechRecognition is available, only on client
  const isSpeechRecognitionSupported =
    mounted &&
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const processAndSendMessage = useCallback(async (question: string) => {
    if (!question.trim()) return;

    const userMessage: Message = { sender: 'user', text: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await askQuestionAction({ 
        propertyId, 
        question: question,
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
    });
    
    setIsLoading(false);

    if (result.success && result.data.answer) {
      const botMessage: Message = { sender: 'bot', text: result.data.answer };
      setMessages((prev) => [...prev, botMessage]);
      handlePlayAudio(result.data.answer, messages.length + 1, true);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'The chatbot is currently unavailable. Please try again later.',
        variant: 'destructive',
      });
    }
  }, [propertyId, reservation.checkInDate, reservation.checkOutDate, toast, messages.length]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await processAndSendMessage(input);
  };

  const handlePlayAudio = async (textToSpeak: string, index: number, autoPlay = false) => {
      setIsSynthesizing(index);
      const result = await generateSpeechAction(textToSpeak);
      setIsSynthesizing(null);

      if (result.success && result.data.media) {
        if (audioRef.current) {
            audioRef.current.src = result.data.media;
            if (autoPlay) {
              audioRef.current.play().catch(e => console.error("Autoplay failed", e));
            } else {
               audioRef.current.play();
            }
        }
      } else {
          toast({
              title: "Audio Error",
              description: result.error || "Could not generate audio. Please try again.",
              variant: "destructive",
          })
      }
  }

  const startWakeWordListener = useCallback(() => {
    if (!isSpeechRecognitionSupported || !recognitionRef.current) return;
    
    setMicState('listening');
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    
    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      if (transcript.toLowerCase().includes('hello keymaster')) {
        stopWakeWordListener();
        startQuestionRecognition();
      }
    };
    
    recognitionRef.current.start();
  }, [isSpeechRecognitionSupported]);

  const stopWakeWordListener = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // prevent onend from firing
      recognitionRef.current.stop();
    }
    setMicState('idle');
  }, []);

  const startQuestionRecognition = useCallback(() => {
    if (!isSpeechRecognitionSupported || !recognitionRef.current) return;

    // Play a sound to indicate it's listening
    const startSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjQ1LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIwARAAAAUklGRhQMAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAMAADD/8A/gD6APgA+AAA=');
    startSound.play();

    setMicState('recognizing');
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    
    recognitionRef.current.onresult = (event) => {
      const question = event.results[0][0].transcript;
      setInput(question); // show recognized text in input
      processAndSendMessage(question);
    };

    recognitionRef.current.onend = () => {
        setMicState('idle'); // Always return to idle after recognition ends
    };

    recognitionRef.current.start();
  }, [isSpeechRecognitionSupported, processAndSendMessage]);

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      toast({ title: "Microphone enabled!" });
      startWakeWordListener();
    } catch (err) {
      toast({ title: "Microphone access was denied.", description: "Please enable it in your browser settings.", variant: "destructive" });
    }
  }

  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSpeechRecognitionSupported]);

  const handleMicClick = async () => {
    if (micState !== 'idle') {
        stopWakeWordListener();
    }
    // The AlertDialogTrigger will open the dialog. The permission request
    // is handled by the "Allow" button in the dialog.
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare />
            Ask a Question
          </CardTitle>
          <CardDescription>
              Have questions about the property? Ask our AI assistant. Click the mic to enable voice commands.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48 w-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'bot' && (
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  )}
                  <div className={`rounded-lg px-4 py-2 max-w-[80%] flex items-center gap-2 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{msg.text}</p>
                    {msg.sender === 'bot' && (
                        <Button size="icon" variant="ghost" onClick={() => handlePlayAudio(msg.text, index)} disabled={isSynthesizing === index} className="h-6 w-6 shrink-0">
                            {isSynthesizing === index ? <Loader2 className="h-4 w-4 animate-spin"/> : <Volume2 className="h-4 w-4" />}
                        </Button>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="p-2 bg-muted rounded-full text-foreground">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                  <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                          <Sparkles className="h-5 w-5" />
                      </div>
                      <div className="rounded-lg px-4 py-2 bg-muted flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or say 'Hello KeyMaster'..."
              disabled={isLoading || micState !== 'idle'}
            />
            {isSpeechRecognitionSupported ? (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button type="button" size="icon" variant="outline" onClick={handleMicClick} disabled={isLoading}>
                            <Mic className={cn(
                                'transition-colors',
                                micState === 'listening' && 'text-blue-500',
                                micState === 'recognizing' && 'text-red-500 animate-pulse',
                            )} />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Enable Voice Commands?</AlertDialogTitle>
                        <AlertDialogDescription>
                            To use voice commands like "Hello KeyMaster", this app needs access to your microphone. We'll only listen when you're on this page.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={requestMicPermission}>Allow</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ) : (
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send />
                </Button>
            )}
            {isSpeechRecognitionSupported && (
                 <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send />
                </Button>
            )}
          </form>
          <audio ref={audioRef} className="hidden" />
        </CardFooter>
      </Card>
    </>
  );
}
