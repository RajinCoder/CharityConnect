"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  
  async function Logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/Home");
    router.refresh();
  }

  return <button onClick={Logout}>Logout</button>;
}
