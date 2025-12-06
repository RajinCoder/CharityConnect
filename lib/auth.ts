import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export type UserPayload = {
  id: string;
  name: string;
  email: string;
};

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as UserPayload;
  } catch (err) {
    return null;
  }
}