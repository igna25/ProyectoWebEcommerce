import Link from "next/link";

export default function RegisterForm() {
  return (
    <div className="w-full max-w-md">
      <form className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-5">
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
            required
            placeholder="••••••••"
            className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#004AAD] hover:bg-[#003d8f] py-2.5 text-sm font-semibold text-white transition-colors"
        >
          Crear cuenta
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
