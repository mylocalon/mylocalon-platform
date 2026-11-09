import { db } from "@/db/pool";
import type { Project } from "@/domain/types";
import { newId } from "@/lib/crypto";
import { conflict, isUniqueViolation, notFound } from "@/lib/errors";

const toProject = (r: { id: string; name: string; created_at: Date }): Project => ({
  id: r.id,
  name: r.name,
  createdAt: r.created_at,
});

export async function createProject(userId: string, name: string): Promise<Project> {
  try {
    const { rows } = await db().query(
      "INSERT INTO projects (id, user_id, name) VALUES ($1, $2, $3) RETURNING id, name, created_at",
      [newId("prj"), userId, name.trim()],
    );
    return toProject(rows[0]);
  } catch (e) {
    if (isUniqueViolation(e)) throw conflict("you already have a project with this name");
    throw e;
  }
}

export async function listProjects(userId: string): Promise<Project[]> {
  const { rows } = await db().query("SELECT id, name, created_at FROM projects WHERE user_id = $1 ORDER BY name", [userId]);
  return rows.map(toProject);
}

export async function deleteProject(userId: string, id: string): Promise<void> {
  const { rowCount } = await db().query("DELETE FROM projects WHERE id = $1 AND user_id = $2", [id, userId]);
  if (!rowCount) throw notFound("project not found");
}
