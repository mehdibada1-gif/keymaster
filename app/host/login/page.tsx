'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { KeyRound, LogIn, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { loginAction } from '@/app/actions';

export const dynamic = 'force-dynamic';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <><Loader2 className="mr-2 animate-spin" />Signing in...</> : <><LogIn className="mr-2" /> Sign In</>}
    </Button>
  );
}

export default function HostLoginPage() {
    const [state, formAction] = useActionState(loginAction, { error: undefined });
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect_url');

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mb-4 inline-block">
                        <KeyRound className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Host Dashboard Login</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                </CardHeader>
                <form action={formAction}>
                    <CardContent className="space-y-4">
                         {state?.error && (
                            <Alert variant="destructive">
                                <AlertTitle>Login Failed</AlertTitle>
                                <AlertDescription>{state.error}</AlertDescription>
                            </Alert>
                        )}
                        <input type="hidden" name="redirect_url" value={redirectUrl || ''} />
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="host@keymaster.com" required defaultValue="ozner@keymaster.com"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required defaultValue="password123"/>
                        </div>
                    </CardContent>
                    <CardFooter>
                       <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
