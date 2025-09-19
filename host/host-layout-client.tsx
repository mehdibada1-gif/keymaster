'use client';

import type { ReactNode } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, KeyRound, LogOut, FileClock } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions";

function LogoutButton({ inHeader }: { inHeader?: boolean }) {
    if (inHeader) {
        return (
            <form action={logoutAction}>
                <Button variant="ghost" size="icon">
                    <LogOut />
                </Button>
            </form>
        );
    }
    return (
        <form action={logoutAction} className="w-full">
            <Button variant="outline" className="w-full justify-start">
                <LogOut className="mr-2" />
                Logout
            </Button>
        </form>
    );
}

type SessionUser = {
  name: string;
  email: string;
} | null

function ClientSidebarMenu() {
    const pathname = usePathname();
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/host/dashboard'}>
                    <Link href="/host/dashboard">
                        <Home />
                        <span>Dashboard</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Properties" isActive={pathname.startsWith('/host/properties')}>
                    <Link href="/host/properties">
                        <Building2 />
                        <span>Properties</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Reservations" isActive={pathname.startsWith('/host/reservations')}>
                    <Link href="/host/reservations">
                        <FileClock />
                        <span>Reservations</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export function HostLayoutClient({ children, user }: { children: ReactNode, user: SessionUser }) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2">
                <KeyRound className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">KeyMaster</span>
            </Link>
        </SidebarHeader>
        <SidebarContent>
          <ClientSidebarMenu />
        </SidebarContent>
        {user && (
          <SidebarFooter className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src="https://picsum.photos/seed/host/40/40" data-ai-hint="person face" />
                      <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-semibold">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                  <LogoutButton />
              </div>
          </SidebarFooter>
        )}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="flex-1" />
            <Button variant="outline" asChild><Link href="/">Guest View</Link></Button>
             {user && (
                <div className="sm:hidden">
                    <LogoutButton inHeader={true} />
                </div>
             )}
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
