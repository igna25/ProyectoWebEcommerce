import clsx from 'clsx'

export default function RegisterForm() {
  return (
    <div className="w-full max-w-md px-4">
      <form className="space-y-6 rounded-xl bg-white p-6 sm:p-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Register</h2>
          <p className="mt-2 text-sm text-gray-600">Únete a nosotros! Por favor, completa los siguientes campos para crear tu cuenta.</p>
        </div>
        <div>
          <label htmlFor="username" className="text-sm font-medium text-gray-800">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            required
            className={clsx(
              'mt-3 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400'
            )}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-800">Email</label>
          <input
            type="email"
            id="email"
            required
            className={clsx(
              'mt-3 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400'
            )}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-gray-800">Contraseña</label>
          <input
            type="password"
            id="password"
            required
            className={clsx(
              'mt-3 block w-full rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400'
            )}
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="text-sm font-medium text-gray-800">Repetir Contraseña</label>
          <input
            type="password"
            id="confirm-password"
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
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
