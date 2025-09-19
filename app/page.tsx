'use client';

import { KeyRound } from 'lucide-react';
import { BookingReferenceForm } from '@/components/guest/booking-reference-form';
import Link from 'next/link';

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <KeyRound className="h-6 w-6 text-primary" />
          <span>KeyMaster</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-card p-3 shadow-sm">
              <KeyRound className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Welcome to KeyMaster
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Your seamless check-in experience starts here. Enter your booking reference to begin.
            </p>
          </div>
          <BookingReferenceForm />
          <p className="text-xs text-muted-foreground">
            Are you a host?{' '}
            <Link href="/host/dashboard" className="underline underline-offset-2">
              Go to your dashboard
            </Link>
            .
          </p>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © {year} KeyMaster. All rights reserved.
      </footer>
    </div>
  );
}
