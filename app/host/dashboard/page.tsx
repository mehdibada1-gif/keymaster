import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllProperties, getAllReservations, getPropertyById } from "@/lib/data";

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'verified':
            return <Badge variant="secondary"><CheckCircle2 className="mr-1 h-3 w-3" />Verified</Badge>;
        case 'pending':
            return <Badge variant="outline"><Circle className="mr-1 h-3 w-3" />Pending</Badge>;
        case 'failed':
            return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" />Failed</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

export default async function HostDashboardPage() {
  const reservations = await getAllReservations();
  const properties = await getAllProperties();

  const pendingVerifications = reservations.filter(r => r.status === 'pending').length;
  const verificationIssues = reservations.filter(r => r.status === 'failed').length;
  // Dummy data for upcoming checkins
  const upcomingCheckins = 4;

  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.name || 'Unknown';
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingVerifications}</div>
            <p className="text-xs text-muted-foreground">Guests waiting for verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Check-ins</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCheckins}</div>
            <p className="text-xs text-muted-foreground">In the next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verificationIssues}</div>
            <p className="text-xs text-muted-foreground">Failed verifications to review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reservations</CardTitle>
          <CardDescription>An overview of your recent guest verifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Booking Reference</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Check-in Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map(res => (
                <TableRow key={res.bookingReference}>
                  <TableCell className="font-medium">{res.guestName}</TableCell>
                  <TableCell>{res.bookingReference}</TableCell>
                  <TableCell>{getPropertyName(res.propertyId)}</TableCell>
                  <TableCell>{res.checkInDate}</TableCell>
                  <TableCell><StatusBadge status={res.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/host/reservations/${res.bookingReference}`}>Review</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
