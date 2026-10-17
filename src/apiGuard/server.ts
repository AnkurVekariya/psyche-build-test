import { requireApiKey } from "./auth";
import { rateLimiter, type Handler, type Request, type Response } from "./rateLimiter";

const routes = new Map<string, Handler>();
const middleware: Handler[] = [];

export function createApi(options: { apiKeys: readonly string[]; enableAuth?: boolean }) {
  middleware.push(rateLimiter(100, 60_000));
  if (options.enableAuth) middleware.push(requireApiKey(options.apiKeys));
  routes.set("/health", () => ({ status: 200, headers: {}, body: { ok: true } }));

  return (req: Request): Response => {
    // Probes reach /health without a key and without counting against the limit.
    if (req.path === "/health") return routes.get("/health")!(req)!;
    for (const m of middleware) {
      const stop = m(req);
      if (stop) return stop;
    }
    return routes.get(req.path)?.(req) ?? { status: 404, headers: {}, body: { error: "not found" } };
  };
}
