'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Wifi, KeyRound, ListChecks, CheckCircle, LogOut, CalendarDays, MapPin } from 'lucide-react';
import type { Property, Reservation } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { FaqChatbot } from './faq-chatbot';
import { Separator } from '../ui/separator';

type StepInstructionsProps = {
  property: Property;
  reservation: Reservation;
  onNext: () => void;
};

export function StepInstructions({ property, reservation, onNext }: StepInstructionsProps) {
  const { wifi, door_code, rules } = property.checkin_instructions;
  const [dates, setDates] = useState<{checkIn: string, checkOut: string} | null>(null);

  useEffect(() => {
    setDates({
      checkIn: new Date(reservation.checkInDate).toLocaleDateString(),
      checkOut: new Date(reservation.checkOutDate).toLocaleDateString()
    });
  }, [reservation.checkInDate, reservation.checkOutDate]);


  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold font-headline">You're all set!</h1>
        <p className="text-muted-foreground">Welcome to {property.name}. Here are your check-in details.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays /> Your Stay
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {dates ? (
            <>
              <p><strong>Check-in:</strong> {dates.checkIn}</p>
              <p><strong>Check-out:</strong> {dates.checkOut}</p>
            </>
          ) : (
            <p>Loading booking dates...</p>
          )}
        </CardContent>
      </Card>
      
      {property.googleMapsUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin /> Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{property.address}</p>
            <Button asChild className="w-full">
              <Link href={property.googleMapsUrl} target="_blank">
                View on Map
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi /> Wi-Fi Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Network:</strong> {wifi.network}</p>
          <p><strong>Password:</strong> {wifi.pass}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound /> Door Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>The code for the main entrance is: <strong className="text-lg">{door_code}</strong></p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks /> House Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            {rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Separator />

      <FaqChatbot propertyId={property.id} reservation={reservation} />

      <Card>
        <CardHeader>
            <CardTitle>Ready to Checkout?</CardTitle>
            <CardDescription>When you are ready to leave, you can proceed to the checkout step.</CardDescription>
        </CardHeader>
        <CardFooter>
            <Button onClick={onNext} className="w-full" variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Proceed to Checkout
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
