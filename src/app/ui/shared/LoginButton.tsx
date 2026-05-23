import Link from "next/link";

const LoginButton = () => {
  return (
    <Link
      href="/login"
      className="px-4 py-1.5 text-sm font-semibold text-white bg-[#004AAD] hover:bg-[#003d8f] rounded-lg transition-colors"
    >
      Iniciar sesión
    </Link>
  );
};

export default LoginButton;
