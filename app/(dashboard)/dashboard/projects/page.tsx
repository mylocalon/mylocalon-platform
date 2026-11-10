import { ActionButton, CreateForm } from "../../../_components/Actions";
import { requireUser } from "@/auth/current";
import { listProjects } from "@/services/projects";

export default async function ProjectsPage() {
  const user = await requireUser("/dashboard/projects");
  const projects = await listProjects(user.id);
  return (
    <>
      <h1>Projects</h1>
      <p className="muted">Group reserved subdomains by project.</p>
      <CreateForm path="/api/v1/projects" field="name" placeholder="Project name" label="Create" />
      <h2>Yours</h2>
      {projects.length === 0 ? (
        <div className="card empty">No projects yet.</div>
      ) : (
        <table>
          <thead>
            <tr><th>Name</th><th className="hide-sm">Created</th><th /></tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td className="hide-sm muted">{p.createdAt.toLocaleDateString()}</td>
                <td style={{ textAlign: "right" }}>
                  <ActionButton method="DELETE" path={`/api/v1/projects/${p.id}`} label="Delete" confirm={`Delete project "${p.name}"? Its subdomains stay reserved.`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
