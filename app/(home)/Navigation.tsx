import { cookies } from "next/headers";
import Link from "next/link";
import { jwtVerify } from "jose";
import LogoutButton from "../components/LogoutButton";

type UserPayload = {
  id: string;
  name: string;
  email: string;
};

export default async function HomeNavBar() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  let user: UserPayload | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      user = payload as UserPayload;
    } catch (err) {
      // invalid or expired token
    }
  }

  return (
    <div className="bg-blue-500 p-4 text-white flex gap-4">
      {user ? (
        <>
          <span>Hello, {user.email}</span>
          <LogoutButton />
        </>
      ) : (
        <Link href="/Account/Login">Login</Link>
      )}
    </div>
  );
}
