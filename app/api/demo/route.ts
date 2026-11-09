import { z } from "zod";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "../../../db";
import { demoRequests } from "../../../db/schema";

const demoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  studio: z.string().trim().min(1).max(160),
  role: z.enum(["Interior design", "Architecture", "Development", "Other"]),
  context: z.string().trim().max(1500).optional().default(""),
  website: z.string().max(500).optional().default(""),
});

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Please submit your request from the Oyra website." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 12000) return Response.json({ error: "Your request is too long. Please shorten the project details." }, { status: 413 });
  let input: unknown;
  try { input = await request.json(); } catch { return Response.json({ error: "We couldn't read your request. Please try again." }, { status: 400 }); }
  const parsed = demoSchema.safeParse(input);
  if (!parsed.success) return Response.json({ error: "Please check your name, work email, company, and field." }, { status: 400 });
  if (parsed.data.website) return Response.json({ received: true });
  const { website: _, ...data } = parsed.data;
  try {
    const db = getDb();
    const existing = await db.select({ id: demoRequests.id }).from(demoRequests).where(eq(demoRequests.id, data.id)).get();
    if (existing) return Response.json({ received: true });
    const recent = await db.select({ id: demoRequests.id }).from(demoRequests).where(and(eq(demoRequests.email, data.email), gt(demoRequests.createdAt, Date.now() - 120000))).get();
    if (recent) return Response.json({ error: "A request with this email was just received. Please wait a couple of minutes before submitting again." }, { status: 429 });
    await db.insert(demoRequests).values({ ...data, createdAt: Date.now() }).onConflictDoNothing();
    return Response.json({ received: true }, { status: 201 });
  } catch {
    return Response.json({ error: "We couldn't save your request right now. Please try again shortly." }, { status: 503 });
  }
}
