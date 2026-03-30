"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    src: "/images/hero/boutique.png",
    alt: "Boutique moderna con detalles serenos",
  },
  {
    src: "/images/hero/entrada.png",
    alt: "Entrada al IAW bazar con estilo costero",
  },
  {
    src: "/images/hero/promocion.png",
    alt: "Promoción en tienda de moda",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[520px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
          Bienvenido a IAW Bazar
        </h1>
        <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto drop-shadow">
          Encuentra los productos de la mejor calidad a los mejores precios.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-white text-[#004AAD] font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
        >
          Ver todos los productos
        </Link>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
        aria-label="Siguiente"
      >
        ›
      </button>
    </div>
  );
}
