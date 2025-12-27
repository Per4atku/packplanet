import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Session, User } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const pg_adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const client = new PrismaClient({ adapter: pg_adapter });
const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    };
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    // Only refresh session cookie if session is valid and fresh
    // Don't delete invalid cookies here to avoid issues during page render
    if (result.session?.fresh) {
      try {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookieStore.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      } catch {
        // Next.js throws when setting cookies during render
      }
    }

    return result;
  }
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
    };
  }
}
