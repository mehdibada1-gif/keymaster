"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Property } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Loader2 } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";


type PropertyFormProps = {
    action: (prevState: any, formData: FormData) => Promise<{ success: boolean, error?: string }>,
    property?: Property | null
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
        {pending ? <><Loader2 className="mr-2 animate-spin" /> Saving...</> : 'Save Property'}
    </Button>
  );
}


export function PropertyForm({ action, property }: PropertyFormProps) {
    const [state, formAction] = useActionState(action, { success: false });
    const router = useRouter();
    const [contractContent, setContractContent] = useState(property?.contract_template || `
<h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Short-Term Rental Agreement</h2>
<p style="margin-bottom: 0.5rem;">This agreement is between the Host and the Guest, {{guest_name}}.</p>
<p style="margin-bottom: 0.5rem;"><strong>Property:</strong> {{property_name}}</p>
<p style="margin-bottom: 0.5rem;"><strong>Address:</strong> {{property_address}}</p>
<p style="margin-bottom: 0.5rem;"><strong>Check-in:</strong> {{checkin_date}}</p>
<p style="margin-bottom: 0.5rem;"><strong>Check-out:</strong> {{checkout_date}}</p>
<h3 style="font-size: 1.125rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">House Rules</h3>
<ul style="list-style-type: disc; list-style-position: inside; margin-bottom: 1rem;">
<li>No smoking indoors.</li>
<li>No parties or events.</li>
</ul>
<p>By signing below, you agree to all terms and conditions of this rental agreement.</p>
`.trim());

    useEffect(() => {
        if(state?.success) {
            router.push('/host/properties');
        }
    }, [state, router])

    return (
        <form action={formAction}>
            {state?.error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Save Failed</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
             <input type="hidden" name="id" defaultValue={property?.id} />
             <input type="hidden" name="contract_template" value={contractContent} />


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                            <CardDescription>Basic information about your property.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Property Name</Label>
                                <Input id="name" name="name" placeholder="e.g., Paradise Villa" defaultValue={property?.name} required />
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Property Type</Label>
                                     <Select name="type" defaultValue={property?.type}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Villa">Villa</SelectItem>
                                            <SelectItem value="Apartment">Apartment</SelectItem>
                                            <SelectItem value="Cottage">Cottage</SelectItem>
                                            <SelectItem value="Riad">Riad</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" placeholder="123 Ocean Drive, Miami, FL" defaultValue={property?.address} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input id="imageUrl" name="imageUrl" placeholder="https://picsum.photos/seed/..." defaultValue={property?.imageUrl} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                                <Input id="googleMapsUrl" name="googleMapsUrl" placeholder="https://www.google.com/maps/search/?api=1&query=..." defaultValue={property?.googleMapsUrl} />
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Check-in Instructions</CardTitle>
                            <CardDescription>Details for your guests to check in smoothly.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="wifi-network">Wi-Fi Network</Label>
                                    <Input id="wifi-network" name="wifi_network" defaultValue={property?.checkin_instructions.wifi.network} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="wifi-pass">Wi-Fi Password</Label>
                                    <Input id="wifi-pass" name="wifi_pass" defaultValue={property?.checkin_instructions.wifi.pass} required/>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="door-code">Door Code</Label>
                                <Input id="door-code" name="door_code" defaultValue={property?.checkin_instructions.door_code} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="rules">House Rules</Label>
                                <Textarea id="rules" name="rules" placeholder="Enter one rule per line." defaultValue={property?.checkin_instructions.rules.join('\n')} required/>
                            </div>
                        </CardContent>
                    </Card>

                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rental Agreement</CardTitle>
                             <CardDescription>The contract template for guests to sign.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <RichTextEditor
                                content={contractContent}
                                onChange={setContractContent}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardFooter className="p-4 justify-end">
                            <Button variant="outline" type="button" className="mr-2" onClick={() => router.back()}>Cancel</Button>
                            <SubmitButton />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </form>
    )
}
