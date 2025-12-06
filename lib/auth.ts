import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export type UserPayload = {
  id: string;
  name: string;
  email: string;
  userType: string;
};

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const result = {
      id: payload.sub as string,
      name: payload.name as string,
      email: payload.email as string,
      userType: payload.userType as string,
    };
    return result;
  } catch (err) {
    console.log("Auth error:", err);
    return null;
  }
}