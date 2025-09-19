import { redirect } from 'next/navigation';

// This is a new page component.
// It will redirect to the dashboard, as there is no standalone reservations page yet.
// The individual reservation pages at /host/reservations/[bookingRef] will work.
export default function ReservationsPage() {
  redirect('/host/dashboard');
}
