import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { getCurrentUser } from "@/lib/auth";
import UserGreetingButton from "../components/UserGreetingButton";
import SearchButton from "../components/SearchButton";


export default async function HomeNavBar() {
  const user = await getCurrentUser();
  return (
    <div className="bg-blue-500 p-4 text-white flex items-center justify-between">
      <Link href="/Home" className="text-xl">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="CharityConnect Logo"
            className="h-12 inline-block"
          />
                  
        </div>
      </Link>
      <SearchButton />
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <UserGreetingButton name={user.name} />
            <LogoutButton />
          </>
        ) : (
          <Link href="/Account/Login">Login</Link>
        )}
      </div>
    </div>
  );
}
