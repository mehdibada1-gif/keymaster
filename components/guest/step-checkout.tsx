'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound } from 'lucide-react';

type StepCheckoutProps = {
    onConfirm: () => void;
};

export function StepCheckout({ onConfirm }: StepCheckoutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Checkout</CardTitle>
        <CardDescription>
          Thank you for staying with us. Please confirm your checkout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <KeyRound className="h-4 w-4" />
          <AlertTitle>Before you leave:</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2">
                <li>Please leave the keys on the kitchen counter.</li>
                <li>Ensure all windows and doors are locked.</li>
                <li>Take out any trash.</li>
            </ul>
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground mt-4">
            By confirming checkout, you will end your session and lose access to the check-in details.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onConfirm} className="w-full" size="lg">
          <LogOut className="mr-2 h-4 w-4" />
          Confirm Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
