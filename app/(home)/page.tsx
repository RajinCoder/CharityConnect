import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 h-screen bg-blue-200">
      <h1>Welcome to CharityConnect</h1>
      <Link className="bg-blue-400 " href="Account/Login" id="wd-login-link">
        Log in
      </Link>
    </div>
  );
}
