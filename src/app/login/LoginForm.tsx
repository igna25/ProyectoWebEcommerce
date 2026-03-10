"use client";

import { signIn } from "next-auth/react";
import { FormEvent } from "react";
import Link from "next/link";

export default function LoginForm() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: true,
    });
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

        <button
          type="submit"
          className="w-full rounded-xl bg-[#004AAD] hover:bg-[#003d8f] py-2.5 text-sm font-semibold text-white transition-colors"
        >
          Iniciar sesión
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
