import { ActionButton, CreateKeyForm } from "../../../_components/Actions";
import { IconKey } from "../../../_site/icons";
import { requireUser } from "@/auth/current";
import { listApiKeys } from "@/services/apiKeys";

export const metadata = { title: "API keys · mylocalon" };

const when = (d: Date | null) => (d ? d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Never");

export default async function KeysPage() {
  const user = await requireUser("/dashboard/keys");
  const keys = await listApiKeys(user.id);
  return (
    <>
      <div className="page-head">
        <div>
          <h1>API keys</h1>
          <p>Keys let the CLI, SDK and scripts open tunnels. Stored hashed, shown only once.</p>
        </div>
      </div>
      <CreateKeyForm />
      <div className="section-title">Your keys</div>
      {keys.length === 0 ? (
        <div className="empty"><span className="empty-icon"><IconKey /></span><strong>No keys yet</strong><span>Running <code>mylocalon login</code> creates one for that computer.</span></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Key</th><th className="hide-sm">Created</th><th className="hide-sm">Last used</th><th className="actions" /></tr></thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} style={k.revokedAt ? { opacity: 0.55 } : undefined}>
                  <td style={{ fontWeight: 550 }}>{k.name}</td>
                  <td><code>{k.prefix}…</code></td>
                  <td className="hide-sm muted">{when(k.createdAt)}</td>
                  <td className="hide-sm muted">{when(k.lastUsedAt)}</td>
                  <td className="actions">
                    {k.revokedAt ? (
                      <span className="badge">Revoked</span>
                    ) : (
                      <ActionButton
                        method="DELETE" path={`/api/v1/keys/${k.id}`} label="Revoke" success={`Revoked “${k.name}”`}
                        confirm={{ title: `Revoke “${k.name}”?`, body: "Tunnels using this key stop on their next reconnect. This can't be undone.", confirm: "Revoke key" }}
                      />
                    )}
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
