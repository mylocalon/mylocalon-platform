import { ActionButton, CreateKeyForm } from "../../../_components/Actions";
import { requireUser } from "@/auth/current";
import { listApiKeys } from "@/services/apiKeys";

export default async function KeysPage() {
  const user = await requireUser("/dashboard/keys");
  const keys = await listApiKeys(user.id);
  return (
    <>
      <h1>API keys</h1>
      <p className="muted">Keys let the CLI and SDK create tunnels. They're stored hashed and shown only once.</p>
      <CreateKeyForm />
      <h2>Your keys</h2>
      {keys.length === 0 ? (
        <div className="card empty">No keys yet. <code>bytezone login</code> creates one for you.</div>
      ) : (
        <table>
          <thead>
            <tr><th>Name</th><th>Key</th><th className="hide-sm">Last used</th><th /></tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td>{k.name}</td>
                <td><code>{k.prefix}…</code></td>
                <td className="hide-sm muted">{k.lastUsedAt ? k.lastUsedAt.toLocaleString() : "never"}</td>
                <td style={{ textAlign: "right" }}>
                  {k.revokedAt ? (
                    <span className="badge muted">revoked</span>
                  ) : (
                    <ActionButton method="DELETE" path={`/api/v1/keys/${k.id}`} label="Revoke" confirm={`Revoke "${k.name}"? Tunnels using it will stop on their next reconnect.`} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
