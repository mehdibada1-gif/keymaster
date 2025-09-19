import { getPropertyById, getReservationByBookingRef, Reservation } from '@/lib/data';
import { CheckInFlow } from '@/components/guest/check-in-flow';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Home } from 'lucide-react';

type Props = {
  params: { propertyId: string };
  searchParams: { ref?: string };
};

export default async function CheckInPage({ params, searchParams }: Props) {
  let property;
  let reservation: Reservation | null = null;

  if (searchParams.ref) {
    reservation = await getReservationByBookingRef(searchParams.ref);
    if (reservation) {
      property = await getPropertyById(reservation.propertyId);
    }
  } else {
    // If there's no booking ref, we might still want to show the property
    // but the flow might be limited. For now, we require a ref.
    property = await getPropertyById(params.propertyId);
  }

  if (!property || !reservation) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 md:px-6 flex justify-between items-center border-b">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <KeyRound className="h-6 w-6 text-primary" />
          <span>KeyMaster</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Home className="h-4 w-4" />
          <span>Start Over</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <CheckInFlow property={property} reservation={reservation} />
      </main>
    </div>
  );
}
