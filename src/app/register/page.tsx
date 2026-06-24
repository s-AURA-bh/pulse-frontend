"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto grid max-w-md gap-4 rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5"
    >
      <h1 className="text-2xl font-black">Create account</h1>

      {error && (
        <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <input
        required
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-md border border-black/10 bg-transparent px-3 py-2 dark:border-white/10"
      />

      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-md border border-black/10 bg-transparent px-3 py-2 dark:border-white/10"
      />

      <input
        required
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-md border border-black/10 bg-transparent px-3 py-2 dark:border-white/10"
      />

      <button
        disabled={loading}
        className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
