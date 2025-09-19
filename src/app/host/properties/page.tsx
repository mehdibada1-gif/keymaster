import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { getAllProperties } from "@/lib/data";
import Link from "next/link";


export default async function HostPropertiesPage() {
    const properties = await getAllProperties();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Properties</h1>
                <Button asChild>
                    <Link href="/host/properties/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Property
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Properties</CardTitle>
                    <CardDescription>Manage your list of rental properties.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {properties.map(prop => (
                                <TableRow key={prop.id}>
                                    <TableCell>
                                        <Image src={prop.imageUrl} alt={prop.name} width={64} height={48} className="rounded-md object-cover" data-ai-hint={prop.imageHint}/>
                                    </TableCell>
                                    <TableCell className="font-medium">{prop.name}</TableCell>
                                    <TableCell>{prop.type}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">Edit</Button>
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
