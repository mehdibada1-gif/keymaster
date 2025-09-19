import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { HostLayoutClient } from "@/components/host/host-layout-client";


type SessionUser = {
  name: string;
  email: string;
}

export default function HostLayout({ children }: { children: ReactNode }) {
  let user: SessionUser | null = null;
  const sessionCookie = cookies().get('session');
  
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session.expires > Date.now()) {
        user = session.user;
      }
    } catch (e) {
        // Invalid cookie
        user = null;
    }
  }

  return (
    <HostLayoutClient user={user}>
        {children}
    </HostLayoutClient>
  );
}
