import { createFileRoute } from "@tanstack/react-router";
import { hasKey, json } from "@/lib/anthropic.server";

export const Route = createFileRoute("/api/health")({
  server: { handlers: { GET: async () => json({ ai: hasKey() }) } },
});
