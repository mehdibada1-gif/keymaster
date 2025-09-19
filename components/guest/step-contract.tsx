'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SignaturePad } from './signature-pad';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Property, Reservation } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';

type StepContractProps = {
  property: Property;
  reservation: Reservation;
  onSigned: () => void;
};

export function StepContract({ property, reservation, onSigned }: StepContractProps) {
  const [hasSigned, setHasSigned] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [contractHtml, setContractHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (property.contract_template) {
      const checkInDate = new Date(reservation.checkInDate).toLocaleDateString();
      const checkOutDate = new Date(reservation.checkOutDate).toLocaleDateString();

      const replacedContract = property.contract_template
        .replace(/{{guest_name}}/g, reservation.guestName)
        .replace(/{{property_name}}/g, property.name)
        .replace(/{{property_address}}/g, property.address)
        .replace(/{{checkin_date}}/g, checkInDate)
        .replace(/{{checkout_date}}/g, checkOutDate);
      
      setContractHtml(replacedContract);
    }
    setIsLoading(false);
  }, [property, reservation]);

  const handleClear = () => {
    const canvas = document.querySelector('canvas');
    if(canvas){
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            setHasSigned(false);
        }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Rental Agreement</CardTitle>
        <CardDescription>
          Please review and sign the agreement below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          {isLoading ? (
             <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: contractHtml }}
            />
          )}
        </ScrollArea>
        
        <div>
          <Label htmlFor="signature-pad" className="font-semibold">Your Signature</Label>
          <SignaturePad 
            onBegin={() => setHasSigned(false)}
            onEnd={() => setHasSigned(true)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I have read and agree to the terms of the rental agreement.
            </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClear} disabled={!hasSigned}>
          Clear Signature
        </Button>
        <Button onClick={onSigned} disabled={!hasSigned || !agreed}>
          Confirm and Sign
        </Button>
      </CardFooter>
    </Card>
  );
}
