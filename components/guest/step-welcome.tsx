'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Property } from '@/lib/data';

type StepWelcomeProps = {
  property: Property;
  onNext: () => void;
};

export function StepWelcome({ property, onNext }: StepWelcomeProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={property.imageUrl}
            alt={`Image of ${property.name}`}
            fill
            className="object-cover"
            data-ai-hint={property.imageHint}
          />
        </div>
        <div className="p-6 pb-0">
          <CardTitle className="font-headline text-2xl">{property.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-2">
            <MapPin className="h-4 w-4" />
            {property.address}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-muted-foreground">
          To access your check-in instructions, you'll need to complete a quick identity verification and sign the rental agreement.
        </p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 p-6 pt-0">
        <Button onClick={onNext} className="w-full" size="lg">
          Start Check-in <ArrowRight className="ml-2" />
        </Button>
        {property.googleMapsUrl && (
            <Button asChild variant="outline" className="w-full" size="lg">
                <Link href={property.googleMapsUrl} target="_blank">
                    <MapPin className="mr-2" /> View on Map
                </Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
