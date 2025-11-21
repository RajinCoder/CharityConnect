"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterModal() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      router.push("/Account/Profile");
    } else {
      // Handle errors
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col  border-gray-400 border shadow-lg px-6 py-10 gap-6 rounded-xl w-1/3 h-[60%]"
    >
      <input
        className="input_box"
        type="text"
        name="name"
        placeholder="Name"
        required
      />
      <input
        className="input_box"
        type="email"
        name="email"
        placeholder="Email"
        required
      />
      <input
        className="input_box"
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <button className="btn" type="submit">
        Register
      </button>
      <Link href="Login" className="text-red-500 hover:underline">
        Login
      </Link>
    </form>
  );
}
