"use client";

import { PropertyForm } from "@/components/host/property-form";
import { createProperty } from "@/app/actions";
import { seedDatabase } from '@/lib/data';
import { Button } from "@/components/ui/button";

export default function NewPropertyPage() {

    // This is a helper for the demo to easily seed the database.
    const handleSeed = async () => {
        await seedDatabase();
        alert('Database has been seeded with initial data!');
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Add New Property</h1>
                    <p className="text-muted-foreground">Fill out the form below to add a new property to your portfolio.</p>
                </div>
                <Button onClick={handleSeed} variant="outline">Seed Database</Button>
            </div>
            <PropertyForm action={createProperty} />
        </div>
    )
}
