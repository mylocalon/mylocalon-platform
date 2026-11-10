import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "../../_components/AuthForm";
import { Logo } from "../../_site/Logo";
import { currentUser, safeNext } from "@/auth/current";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await currentUser()) redirect(next);
  return (
    <div className="center">
      <div className="card">
        <Link href="/" aria-label="mylocalon home" className="auth-logo"><Logo size={40} id="ml-auth" /></Link>
        <h1>Create your account</h1>
        <p className="muted">Password must be at least 10 characters.</p>
        <AuthForm mode="signup" next={next} />
        <p className="muted">
          Have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
