import { createHash, createHmac, timingSafeEqual } from "crypto";

// Rahasia server (tidak pernah dikirim ke browser).
function secret(): string {
  const value = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("Konfigurasi rahasia sesi belum lengkap.");
  return value;
}

export function hashPin(pin: string, playerId: string): string {
  return createHash("sha256").update(`${secret()}:${playerId}:${pin}`).digest("hex");
}

export function signToken(playerId: string): string {
  const signature = createHmac("sha256", secret()).update(playerId).digest("hex");
  return `${playerId}.${signature}`;
}

// Mengembalikan id murid jika token valid, atau null jika tidak.
export function verifyToken(token: string | null | undefined): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const id = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(createHmac("sha256", secret()).update(id).digest("hex"));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return id;
}

export function bearer(request: Request): string | null {
  return request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
}
