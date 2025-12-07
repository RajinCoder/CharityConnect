"use client";

export default function UserGreetingButton(user: { name: string }) {


  return <button onClick={() => (window.location.href = `/Account/Profile`)}>Hello, {user.name}</button>
}
