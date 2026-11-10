import { ActionButton, CreateForm } from "../../../_components/Actions";
import { IconGlobe } from "../../../_site/icons";
import { CopyButton } from "../../../_site/ui";
import { requireUser } from "@/auth/current";
import { getConfig } from "@/lib/config";
import { listProjects } from "@/services/projects";
import { listReserved } from "@/services/subdomains";

export const metadata = { title: "Subdomains · mylocalon" };

export default async function SubdomainsPage() {
  const user = await requireUser("/dashboard/subdomains");
  const [subs, projects] = await Promise.all([listReserved(user.id), listProjects(user.id)]);
  const c = getConfig();
  const projectName = new Map(projects.map((p) => [p.id, p.name]));
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Reserved subdomains</h1>
          <p>Keep the same URL every time — {subs.length} of {c.MAX_RESERVED_SUBDOMAINS} used.</p>
        </div>
      </div>
      <CreateForm
        path="/api/v1/subdomains" field="name" placeholder="myapp" label="Reserve" suffix={`.${c.BASE_DOMAIN}`}
        validate="subdomain" success={`Reserved {value}.${c.BASE_DOMAIN}`}
        extra={{ name: "projectId", label: "Project", options: projects.map((p) => ({ value: p.id, label: p.name })) }}
      />
      <div className="section-title">Yours</div>
      {subs.length === 0 ? (
        <div className="empty"><span className="empty-icon"><IconGlobe /></span><strong>No reserved subdomains</strong><span>Reserve a name above, then run <code>mylocalon http 3000 --subdomain myapp</code>.</span></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Subdomain</th><th className="hide-sm">Project</th><th className="hide-sm">Use it</th><th className="actions" /></tr></thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td><code>{s.name}.{c.BASE_DOMAIN}</code></td>
                  <td className="hide-sm muted">{s.projectId ? projectName.get(s.projectId) : "—"}</td>
                  <td className="hide-sm"><CopyButton text={`mylocalon http 3000 --subdomain ${s.name}`} label="Copy command" /></td>
                  <td className="actions">
                    <ActionButton
                      method="DELETE" path={`/api/v1/subdomains/${s.name}`} label="Release" success={`Released ${s.name}`}
                      confirm={{ title: `Release ${s.name}.${c.BASE_DOMAIN}?`, body: "Anyone will be able to reserve this name afterwards.", confirm: "Release" }}
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
