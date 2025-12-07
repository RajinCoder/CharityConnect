import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return Response.json({ user: null });

  try {
    const { payload } = await jwtVerify(token, secret);
    return Response.json({ user: payload });
  } catch {
    return Response.json({ user: null });
  }
}
