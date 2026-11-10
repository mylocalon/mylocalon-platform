import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "../../_components/AuthForm";
import { AuthShell } from "../../_site/AuthShell";
import { currentUser, safeNext } from "@/auth/current";

export const metadata = { title: "Sign up · mylocalon" , robots: { index: false, follow: true } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await currentUser()) redirect(next);
  return (
    <AuthShell>
      <h1>Create your account</h1>
      <p>Free forever for development. No credit card.</p>
      <AuthForm mode="signup" next={next} />
      <p className="auth-alt">Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Log in</Link></p>
    </AuthShell>
  );
}
