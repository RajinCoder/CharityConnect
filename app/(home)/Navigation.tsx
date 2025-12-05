import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

export default async function HomeNavBar() {
  const user = await getCurrentUser();
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
