"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!navigator.onLine) {
      setError("Sin conexión. El registro requiere conexión a internet.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "No se pudo crear la cuenta.");
      }
    } catch {
      setError("Sin conexión. El registro requiere conexión a internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-5"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crear cuenta</h2>
          <p className="mt-1 text-sm text-gray-500">
            Completá los campos para unirte a IAW-commerce.
          </p>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="tu@email.com"
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="••••••••"
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-gray-700"
          >
            Repetir contraseña
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
            placeholder="••••••••"
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition"
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#004AAD] hover:bg-[#003d8f] py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="text-[#004AAD] font-semibold hover:underline"
          >
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
