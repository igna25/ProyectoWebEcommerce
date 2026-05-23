import HomePage from "./ui/shared/HomePage";
import NavBar from "./ui/shared/NavBar";
import HeroCarousel from "./ui/shared/HeroCarousel";
import Link from "next/link";

const LandingPage = () => {
  return (
    <>
      <NavBar />
      <div className="bg-gray-50 min-h-screen">
        <HeroCarousel />

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
