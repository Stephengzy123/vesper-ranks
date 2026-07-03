import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

type SessionRole = "admin" | "manager";

type SessionPayload = {
  role: SessionRole;
  slug?: string;
  exp: number;
};

const COOKIE_NAME = "vesper_session";

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 24) {
    throw new Error("SESSION_SECRET must be at least 24 characters.");
  }
  return value;
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

function encode(payload: SessionPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

function decode(value?: string): SessionPayload | null {
  if (!value) return null;
  const [data, sig] = value.split(".");
  if (!data || !sig) return null;

  const expected = sign(data);
  const ok =
    Buffer.byteLength(sig) === Buffer.byteLength(expected) &&
    timingSafeEqual(Buffer.from(sig), Buffer.from(expected));

  if (!ok) return null;

  const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
  if (payload.exp < Date.now()) return null;
  return payload;
}

export async function setSession(role: SessionRole, slug?: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, encode({ role, slug, exp: Date.now() + 1000 * 60 * 60 * 12 }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession() {
  const jar = await cookies();
  return decode(jar.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== "admin") {
    throw new Error("Admin session required.");
  }
}

export async function requireManager(slug: string) {
  const session = await getSession();
  if (session?.role !== "manager" || session.slug !== slug) {
    throw new Error("Manager session required.");
  }
}
