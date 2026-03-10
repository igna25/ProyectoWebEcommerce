import Link from "next/link";
import HomePage from "./ui/shared/HomePage";
import NavBar from "./ui/shared/NavBar";

const LandingPage = () => {
  return (
    <>
      <NavBar />
      <div className="bg-gray-50 min-h-screen">
        <section className="bg-gradient-to-br from-gray-900 via-[#003580] to-[#004AAD] text-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Bienvenido a nuestra tienda
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Encuentra los productos de la mejor calidad a los mejores precios.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-white text-[#004AAD] font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Ver todos los productos
            </Link>
          </div>
        </section>

        <main>
          <section className="bg-white py-2">
            <HomePage />
          </section>

          <section className="bg-gray-900 py-16 px-4">
            <div className="max-w-2xl mx-auto text-white text-center">
              <h2 className="text-3xl font-bold mb-3">¿Listo para empezar?</h2>
              <p className="text-gray-400 mb-8">
                Explora nuestra colección y encuentra lo que necesitas.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-[#004AAD] hover:bg-[#003d8f] text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Ver todos los productos
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default LandingPage;
