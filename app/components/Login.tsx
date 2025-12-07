"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ErrorModal from "./ErrorModal";

export default function LoginModal() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setLoginSuccess(true);
      router.push("/Account/Profile");
      router.refresh();
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error || "Login failed");
    }
  }

  if (loginSuccess) {
    return (
      <div className="flex flex-col items-center justify-center border-gray-400 border shadow-lg px-6 py-10 gap-6 rounded-xl w-1/3">
        <h2 className="text-2xl font-bold text-green-600">Login Successful!</h2>
        <p className="text-gray-700">Welcome back!</p>
        <Link 
          href="/Account/Profile" 
          className="btn"
        >
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  border-gray-400 border shadow-lg px-6 py-10 gap-6 rounded-xl w-1/3 h-1/2"
      >
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
          Login
        </button>
        <Link href="Register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </form>
      {errorMessage && <ErrorModal message={errorMessage} />}
    </>
  );
}
