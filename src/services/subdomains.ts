import { db } from "@/db/pool";
import { checkSubdomain } from "@/domain/subdomain";
import type { Reserved } from "@/domain/types";
import { getConfig } from "@/lib/config";
import { newId } from "@/lib/crypto";
import { conflict, isUniqueViolation, notFound, unprocessable } from "@/lib/errors";

const toReserved = (r: { id: string; name: string; project_id: string | null; created_at: Date }): Reserved => ({
  id: r.id,
  name: r.name,
  projectId: r.project_id,
  createdAt: r.created_at,
});

export async function reserveSubdomain(userId: string, rawName: string, projectId?: string): Promise<Reserved> {
  const name = rawName.trim().toLowerCase();
  const problem = checkSubdomain(name);
  if (problem === "invalid") {
    throw unprocessable("subdomain must be 3–63 chars of a–z, 0–9 and single hyphens, not starting/ending with a hyphen");
  }
  if (problem === "blocked") throw unprocessable(`"${name}" is a reserved word`);

  const { rows: count } = await db().query(
    "SELECT count(*)::int AS n FROM reserved_subdomains WHERE user_id = $1 AND released_at IS NULL",
    [userId],
  );
  if (count[0].n >= getConfig().MAX_RESERVED_SUBDOMAINS) {
    throw unprocessable(`your plan allows ${getConfig().MAX_RESERVED_SUBDOMAINS} reserved subdomains`);
  }
  if (projectId) {
    const { rowCount } = await db().query("SELECT 1 FROM projects WHERE id = $1 AND user_id = $2", [projectId, userId]);
    if (!rowCount) throw notFound("project not found");
  }
  try {
    const { rows } = await db().query(
      `INSERT INTO reserved_subdomains (id, user_id, name, project_id) VALUES ($1, $2, $3, $4)
       RETURNING id, name, project_id, created_at`,
      [newId("sub"), userId, name, projectId ?? null],
    );
    return toReserved(rows[0]);
  } catch (e) {
    if (isUniqueViolation(e)) throw conflict(`"${name}" is already taken`);
    throw e;
  }
}

export async function releaseSubdomain(userId: string, name: string): Promise<void> {
  const { rowCount } = await db().query(
    "UPDATE reserved_subdomains SET released_at = now() WHERE user_id = $1 AND name = $2 AND released_at IS NULL",
    [userId, name.toLowerCase()],
  );
  if (!rowCount) throw notFound("subdomain not reserved by you");
}

export async function listReserved(userId: string): Promise<Reserved[]> {
  const { rows } = await db().query(
    `SELECT id, name, project_id, created_at FROM reserved_subdomains
     WHERE user_id = $1 AND released_at IS NULL ORDER BY name`,
    [userId],
  );
  return rows.map(toReserved);
}

export async function isOwnedBy(userId: string, name: string): Promise<boolean> {
  const { rowCount } = await db().query(
    "SELECT 1 FROM reserved_subdomains WHERE user_id = $1 AND name = $2 AND released_at IS NULL",
    [userId, name],
  );
  return Boolean(rowCount);
}

/** Every currently reserved name — the Gateway avoids these for random subdomains. */
export async function allReservedNames(): Promise<string[]> {
  const { rows } = await db().query("SELECT name FROM reserved_subdomains WHERE released_at IS NULL ORDER BY name");
  return rows.map((r) => r.name);
}
