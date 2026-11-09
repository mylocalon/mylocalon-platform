import { DeviceDecision } from "../../_components/Actions";
import { requireUser } from "@/auth/current";
import { describeDeviceCode, normalizeUserCode } from "@/services/device";

export default async function DevicePage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const code = normalizeUserCode((await searchParams).code ?? "");
  await requireUser(`/device?code=${encodeURIComponent(code)}`);

  if (!code) {
    return (
      <>
        <h1>Connect the CLI</h1>
        <form className="row" method="get">
          <input name="code" placeholder="ABCD-EFGH" required aria-label="Code from your terminal" />
          <button>Continue</button>
        </form>
      </>
    );
  }
  const info = await describeDeviceCode(code);
  return (
    <>
      <h1>Connect the CLI</h1>
      {!info ? (
        <p className="err">This code is invalid or has expired. Run <code>mylocalon login</code> again.</p>
      ) : info.status !== "pending" ? (
        <p className="muted">This request was already {info.status}.</p>
      ) : (
        <div className="card">
          <p style={{ marginTop: 0 }}>
            <strong>{info.clientName}</strong> is asking to access your mylocalon account.
          </p>
          <p>
            Confirm the code matches your terminal: <code style={{ fontSize: 16 }}>{code}</code>
          </p>
          <p className="muted">Approving creates an API key for this device. You can revoke it under API keys.</p>
          <DeviceDecision code={code} />
        </div>
      )}
    </>
  );
}
