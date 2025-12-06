import { cookies } from "next/headers";
import Link from "next/link";
import { jwtVerify } from "jose";
import LogoutButton from "../components/LogoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

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
    <div className="bg-blue-500 p-4 text-white flex items-center justify-between">
      <Link href="/Home" className="text-xl">
        <img src="/images/logo2.png" alt="CharityConnect Logo" className="h-12 inline-block mr-2" />
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span>Hello, {user.name}</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/Account/Login">Login</Link>
        )}
      </div>
    </div>
  );
}
