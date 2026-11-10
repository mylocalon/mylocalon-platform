import { ActionButton, CreateForm } from "../../../_components/Actions";
import { IconFolder } from "../../../_site/icons";
import { requireUser } from "@/auth/current";
import { listProjects } from "@/services/projects";
import { listReserved } from "@/services/subdomains";

export const metadata = { title: "Projects · mylocalon" };

export default async function ProjectsPage() {
  const user = await requireUser("/dashboard/projects");
  const [projects, subs] = await Promise.all([listProjects(user.id), listReserved(user.id)]);
  const count = (id: string) => subs.filter((s) => s.projectId === id).length;
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Projects</h1>
          <p>Group reserved subdomains, e.g. per client or app.</p>
        </div>
      </div>
      <CreateForm path="/api/v1/projects" field="name" placeholder="Project name" label="Create" success="Created project “{value}”" />
      <div className="section-title">Yours</div>
      {projects.length === 0 ? (
        <div className="empty"><span className="empty-icon"><IconFolder /></span><strong>No projects yet</strong><span>Projects are optional — they just keep subdomains organised.</span></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th className="hide-sm">Subdomains</th><th className="hide-sm">Created</th><th className="actions" /></tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className="wrap-anywhere">
                    <span style={{ fontWeight: 550 }}>{p.name}</span>
                    <div className="show-sm muted" style={{ fontSize: 13 }}>{count(p.id) === 1 ? "1 subdomain" : `${count(p.id)} subdomains`}</div>
                  </td>
                  <td className="hide-sm muted" style={{ fontVariantNumeric: "tabular-nums" }}>{count(p.id)}</td>
                  <td className="hide-sm muted">{p.createdAt.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="actions">
                    <ActionButton
                      method="DELETE" path={`/api/v1/projects/${p.id}`} label="Delete" success={`Deleted “${p.name}”`}
                      confirm={{ title: `Delete project “${p.name}”?`, body: "Its subdomains stay reserved.", confirm: "Delete project" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
