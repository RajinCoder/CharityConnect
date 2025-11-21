"use client";

import { redirect } from "next/navigation";

export default function LogoutButton() {
  async function Logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    redirect("/Dashboard");
  }

  return <button onClick={Logout}>Logout</button>;
}
