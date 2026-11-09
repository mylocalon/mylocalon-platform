import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/domain/types";
import { getUser } from "@/services/users";
import { SESSION_COOKIE, sessionUser } from "./session";

/** Server components: the signed-in user, or null. */
export async function currentUser(): Promise<User | null> {
  const id = await sessionUser((await cookies()).get(SESSION_COOKIE)?.value);
  return id ? getUser(id) : null;
}

/** Server components: the signed-in user, or redirect to /login?next=… */
export async function requireUser(next: string): Promise<User> {
  const u = await currentUser();
  if (!u) redirect(`/login?next=${encodeURIComponent(next)}`);
  return u;
}

/** Only allow same-site relative redirects after login. */
export function safeNext(next: string | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
