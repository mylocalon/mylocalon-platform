import { NextResponse, type NextRequest } from "next/server";

/**
 * Markdown content negotiation for docs: a client that asks for
 * `Accept: text/markdown` gets the page's Markdown instead of HTML.
 * Browsers never send that header first, so humans always get HTML.
 */
export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";
  const m = /^\/docs(?:\/([a-z0-9-]+))?\/?$/.exec(req.nextUrl.pathname);
  if (m && /^\s*text\/markdown/.test(accept)) {
    const url = req.nextUrl.clone();
    url.pathname = `/docs-md/${m[1] ?? "introduction"}`;
    const res = NextResponse.rewrite(url);
    res.headers.set("vary", "Accept");
    return res;
  }
  const res = NextResponse.next();
  if (m) res.headers.set("vary", "Accept");
  return res;
}

export const config = { matcher: ["/docs", "/docs/:slug*"] };
