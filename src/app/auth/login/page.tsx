"use client";

import { signIn } from "next-auth/react"; // Ini wajib di sisi client
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // signIn dari next-auth/react akan menangani cookie secara otomatis
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Email atau password salah.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-10 rounded-[30px] shadow-xl w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/maskot.png" alt="Maskot" width={120} height={120} className="mx-auto" />
          <h3 className="text-2xl font-bold text-blue-600">Login Admin</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" required placeholder="Email" className="w-full p-3 border rounded-xl" />
          <input name="password" type="password" required placeholder="Password" className="w-full p-3 border rounded-xl" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}