import { getReservationByBookingRef, getPropertyById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ThumbsDown, ThumbsUp, User, FileText, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Props = {
    params: { bookingRef: string };
};

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'verified':
            return <Badge variant="secondary" className="text-base"><Check className="mr-2 h-4 w-4" />Verified</Badge>;
        case 'pending':
            return <Badge variant="outline" className="text-base">Pending Review</Badge>;
        case 'failed':
            return <Badge variant="destructive" className="text-base">Failed</Badge>;
        default:
            return <Badge variant="outline" className="text-base">{status}</Badge>;
    }
}


export default async function ReservationReviewPage({ params }: Props) {
    const reservation = await getReservationByBookingRef(params.bookingRef);
    if (!reservation) {
        notFound();
    }

    const property = await getPropertyById(reservation.propertyId);
    if (!property) {
        // This case should ideally not happen if data is consistent
        notFound();
    }
    
    const checkInDate = new Date(reservation.checkInDate).toLocaleDateString();
    const checkOutDate = new Date(reservation.checkOutDate).toLocaleDateString();

    const contractHtml = property.contract_template
        .replace(/{{guest_name}}/g, reservation.guestName)
        .replace(/{{property_name}}/g, property.name)
        .replace(/{{property_address}}/g, property.address)
        .replace(/{{checkin_date}}/g, checkInDate)
        .replace(/{{checkout_date}}/g, checkOutDate);


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className='flex items-center gap-4'>
                     <Button variant="outline" size="icon" asChild>
                        <Link href="/host/dashboard"><ArrowLeft /></Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Review Reservation</h1>
                        <p className="text-muted-foreground">Booking Ref: {reservation.bookingReference}</p>
                    </div>
                </div>
                 <StatusBadge status={reservation.status} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User /> Guest Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Name:</strong> {reservation.guestName}</p>
                            <p><strong>Property:</strong> {property.name}</p>
                            <p><strong>Check-in:</strong> {checkInDate}</p>
                            <p><strong>Check-out:</strong> {checkOutDate}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Camera/> Submitted Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold">ID Document</h3>
                                <Image src="https://picsum.photos/seed/idcard/600/400" data-ai-hint="id card" alt="ID Document" width={600} height={400} className="rounded-lg mt-2 object-cover" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Selfie</h3>
                                <Image src="https://picsum.photos/seed/selfie/600/600" data-ai-hint="person selfie" alt="Selfie" width={600} height={600} className="rounded-lg mt-2 object-cover" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column */}
                <div className="md:col-span-2 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText /> Signed Agreement</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="h-64 w-full rounded-md border p-4 overflow-auto bg-white dark:bg-zinc-800">
                                <div
                                    className="prose prose-sm max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: contractHtml }}
                                />
                            </div>
                             <div className='mt-4'>
                                <h3 className="font-semibold mb-2">Guest Signature</h3>
                                <div className="rounded-md border p-4 bg-white dark:bg-zinc-800 flex items-center justify-center">
                                    <Image src="https://picsum.photos/seed/signature/300/100" data-ai-hint="handwritten signature" alt="Signature" width={300} height={100} className="object-contain" />
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification Actions</CardTitle>
                            <CardDescription>Manually approve or reject this guest's verification.</CardDescription>
                        </CardHeader>
                        <CardFooter className="gap-4">
                            <Button variant="destructive"><ThumbsDown className='mr-2'/> Reject</Button>
                            <Button className="bg-green-600 hover:bg-green-700"><ThumbsUp className='mr-2'/> Approve Verification</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
