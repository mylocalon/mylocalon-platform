import { DeviceDecision } from "../../_components/Actions";
import { requireUser } from "@/auth/current";
import { describeDeviceCode, normalizeUserCode } from "@/services/device";

export const metadata = { title: "Connect the CLI · mylocalon" };

export default async function DevicePage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const code = normalizeUserCode((await searchParams).code ?? "");
  await requireUser(`/device?code=${encodeURIComponent(code)}`);
  const info = code ? await describeDeviceCode(code) : null;

  return (
    <div style={{ maxWidth: 480, margin: "6vh auto 0" }}>
      <div className="card card-pad-lg">
        <h1>Connect the CLI</h1>
        {!code ? (
          <>
            <p className="muted">Enter the code shown in your terminal.</p>
            <form className="row" method="get" style={{ marginTop: 16 }}>
              <input name="code" placeholder="ABCD-EFGH" required aria-label="Code from your terminal" style={{ flex: 1, fontFamily: "var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase" }} />
              <button className="btn btn-primary">Continue</button>
            </form>
          </>
        ) : !info ? (
          <p className="err">This code is invalid or has expired. Run <code>mylocalon login</code> again.</p>
        ) : info.status !== "pending" ? (
          <p className="muted">This request was already {info.status}.</p>
        ) : (
          <>
            <p className="muted" style={{ margin: 0 }}><strong style={{ color: "var(--text)" }}>{info.clientName}</strong> wants to access your account.</p>
            <div className="device-code" aria-label={`Code ${code}`}>{code}</div>
            <p className="muted" style={{ fontSize: 13.5, marginTop: 0 }}>Check that this matches your terminal. Approving creates an API key for this computer — you can revoke it any time.</p>
            <DeviceDecision code={code} />
          </>
        )}
      </div>
    </div>
  );
}
