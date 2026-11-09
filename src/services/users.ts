import { db } from "@/db/pool";
import { burnVerify, hashSecret, verifySecret } from "@/auth/password";
import { newId } from "@/lib/crypto";
import { conflict, isUniqueViolation, unauthorized } from "@/lib/errors";
import type { User } from "@/domain/types";

const toUser = (r: { id: string; email: string; created_at: Date }): User => ({
  id: r.id,
  email: r.email,
  createdAt: r.created_at,
});

export async function createUser(email: string, password: string): Promise<User> {
  const id = newId("usr");
  try {
    const { rows } = await db().query(
      "INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, created_at",
      [id, email.trim(), await hashSecret(password)],
    );
    return toUser(rows[0]);
  } catch (e) {
    if (isUniqueViolation(e)) throw conflict("an account with this email already exists");
    throw e;
  }
}

/** Same error and similar timing whether the email exists or not. */
export async function authenticateUser(email: string, password: string): Promise<User> {
  const { rows } = await db().query(
    "SELECT id, email, created_at, password_hash FROM users WHERE lower(email) = lower($1)",
    [email.trim()],
  );
  const row = rows[0];
  if (!row) {
    await burnVerify(password);
    throw unauthorized("invalid email or password");
  }
  if (!(await verifySecret(row.password_hash, password))) throw unauthorized("invalid email or password");
  return toUser(row);
}

export async function getUser(id: string): Promise<User | null> {
  const { rows } = await db().query("SELECT id, email, created_at FROM users WHERE id = $1", [id]);
  return rows[0] ? toUser(rows[0]) : null;
}
