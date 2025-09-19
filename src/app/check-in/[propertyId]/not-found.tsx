import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, KeyRound } from 'lucide-react';

export default function NotFound() {
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
            <div className="inline-block rounded-lg bg-destructive/10 p-3 text-destructive">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Property Not Found
            </h1>
            <p className="text-muted-foreground md:text-xl">
              We couldn't find a property with that ID. Please check the ID and try again.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
