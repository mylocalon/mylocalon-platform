import { ActionButton, CreateForm } from "../../../_components/Actions";
import { requireUser } from "@/auth/current";
import { getConfig } from "@/lib/config";
import { listProjects } from "@/services/projects";
import { listReserved } from "@/services/subdomains";

export default async function SubdomainsPage() {
  const user = await requireUser("/dashboard/subdomains");
  const [subs, projects] = await Promise.all([listReserved(user.id), listProjects(user.id)]);
  const c = getConfig();
  const projectName = new Map(projects.map((p) => [p.id, p.name]));
  return (
    <>
      <h1>Reserved subdomains</h1>
      <p className="muted">
        Keep a stable URL across restarts. Your plan allows {c.MAX_RESERVED_SUBDOMAINS}. Use with{" "}
        <code>mylocalon http 3000 --subdomain NAME</code>. Running tunnels pick up new reservations on their next connect.
      </p>
      <CreateForm
        path="/api/v1/subdomains"
        field="name"
        placeholder="myapp"
        label="Reserve"
        extra={{ name: "projectId", options: projects.map((p) => ({ value: p.id, label: p.name })) }}
      />
      <h2>Yours</h2>
      {subs.length === 0 ? (
        <div className="card empty">None reserved.</div>
      ) : (
        <table>
          <thead>
            <tr><th>Subdomain</th><th className="hide-sm">Project</th><th /></tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id}>
                <td><code>{s.name}.{c.BASE_DOMAIN}</code></td>
                <td className="hide-sm muted">{s.projectId ? projectName.get(s.projectId) : "—"}</td>
                <td style={{ textAlign: "right" }}>
                  <ActionButton method="DELETE" path={`/api/v1/subdomains/${s.name}`} label="Release" confirm={`Release ${s.name}? Someone else may claim it.`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
