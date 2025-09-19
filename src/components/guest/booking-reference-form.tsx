'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getReservationByBookingRef } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function BookingReferenceForm() {
  const [bookingRef, setBookingRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookingRef.trim()) return;
    setIsLoading(true);

    // In a real app, you'd fetch this from your backend.
    const reservation = await getReservationByBookingRef(bookingRef.trim());

    if (reservation) {
      // Redirect to the check-in page for the correct property
      router.push(`/check-in/${reservation.propertyId}?ref=${reservation.bookingReference}`);
    } else {
      toast({
        title: 'Booking Not Found',
        description: 'Please check your booking reference and try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Enter Booking Reference"
        value={bookingRef}
        onChange={(e) => setBookingRef(e.target.value)}
        className="text-center text-lg h-12"
        disabled={isLoading}
      />
      <Button type="submit" size="lg" disabled={isLoading || !bookingRef.trim()}>
        {isLoading ? <Loader2 className="animate-spin" /> : 'Begin Check-in'}
      </Button>
    </form>
  );
}
