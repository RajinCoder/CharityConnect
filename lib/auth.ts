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
    return {
        id: payload.sub as string,
        name: payload.name as string,
        email: payload.email as string,
    }
  } catch (err) {
    return null;
  }
}