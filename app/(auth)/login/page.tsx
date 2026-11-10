import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "../../_components/AuthForm";
import { AuthShell } from "../../_site/AuthShell";
import { currentUser, safeNext } from "@/auth/current";

export const metadata = { title: "Log in · mylocalon" , robots: { index: false, follow: true } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await currentUser()) redirect(next);
  return (
    <AuthShell>
      <h1>Welcome back</h1>
      <p>Log in to manage your tunnels, subdomains and API keys.</p>
      <AuthForm mode="login" next={next} />
      <p className="auth-alt">New to mylocalon? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link></p>
    </AuthShell>
  );
}
