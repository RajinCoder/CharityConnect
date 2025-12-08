"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserGreetingButton(user: { name: string }) {
  const router = useRouter();
  return (
    <Link 
      href="/Account/Profile" 
      onClick={() => router.refresh()}    >
      Hello, {user.name}
    </Link>
  );
}
