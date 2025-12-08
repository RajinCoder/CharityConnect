"use client";

import Link from "next/link";

export default function UserGreetingButton(user: { name: string }) {
  return <Link href="/Account/Profile">Hello, {user.name}</Link>;
}
