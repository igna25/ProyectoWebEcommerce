import Link from "next/link";

const HomeButton = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
    >
      Inicio
    </Link>
  );
};

export default HomeButton;
