'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

import clsx from 'clsx'
import Link from 'next/link';

export default function LoginForm() {

  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: true,
    });

  };

  return (
    <div className="w-full max-w-md px-4">
      <form  onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 sm:p-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
          <p className="mt-2 text-sm text-gray-600">Bienvenido de nuevo! Por favor, ingresa tus datos para continuar comprando.</p>
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-800">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
            className={clsx(
              'mt-3 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400'
            )}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-gray-800">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="contraseña"
            required
            className={clsx(
              'mt-3 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400'
            )}
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta? <Link href="/register" className="text-blue-600 hover:underline">Regístrate aquí</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
