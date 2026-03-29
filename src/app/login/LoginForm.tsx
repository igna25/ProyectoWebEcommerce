"use client";

import { signIn, getSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!navigator.onLine) {
      setError("Sin conexión. No podés iniciar sesión offline.");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Email o contraseña incorrectos.");
    } else {
      const session = await getSession();
      if ((session?.user as any)?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-5"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido</h2>
          <p className="mt-1 text-sm text-gray-500">
            Ingresá tus datos para continuar comprando.
          </p>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="tu@email.com"
            required
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
            placeholder="••••••••"
            required
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition"
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#004AAD] hover:bg-[#003d8f] py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Verificando..." : "Iniciar sesión"}
        </button>

        <p className="text-center text-sm text-gray-500">
          ¿No tenés cuenta?{" "}
          <Link
            href="/register"
            className="text-[#004AAD] font-semibold hover:underline"
          >
            Registrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
