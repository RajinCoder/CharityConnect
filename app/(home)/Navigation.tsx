import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { getCurrentUser } from "@/lib/auth";

type UserPayload = {
  id: string;
  name: string;
  email: string;
};

export default async function HomeNavBar() {
  const user = await getCurrentUser();
  return (
    <div className="bg-blue-500 p-4 text-white flex items-center justify-between">
      <Link href="/Home" className="text-xl">
        <img
          src="/images/logo2.png"
          alt="CharityConnect Logo"
          className="h-12 inline-block mr-2"
        />
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
