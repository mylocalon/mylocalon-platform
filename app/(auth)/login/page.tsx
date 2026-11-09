import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "../../_components/AuthForm";
import { currentUser, safeNext } from "@/auth/current";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await currentUser()) redirect(next);
  return (
    <div className="center">
      <div className="card">
        <h1>Log in to mylocalon</h1>
        <p className="muted">Expose localhost on a public URL.</p>
        <AuthForm mode="login" next={next} />
        <p className="muted">
          No account? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
