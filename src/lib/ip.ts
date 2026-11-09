/**
 * Client IP. The Platform only listens on localhost behind Caddy, which
 * appends the real peer as the last X-Forwarded-For hop.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",").at(-1)?.trim() || "local";
}
