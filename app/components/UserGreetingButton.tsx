"use client";

export default function UserGreetingButton(user: { name: string }) {


  return <button onClick={() => (window.location.href = `/profile/${encodeURIComponent(
                          user.name
                        )}`)}>Hello, {user.name}</button>
}
