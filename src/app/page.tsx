import React, { Fragment } from 'react';
import Link from 'next/link';
import HomePage from './ui/HomePage';
import NavBar from './ui/navBar';
import { Button } from '@headlessui/react';

const LandingPage = () => {
  return (
    <Fragment>
      
      <NavBar></NavBar>
      <div className="bg-gray-100 min-h-screen">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Bienvenido a Nuestra Tienda</h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  Encuentra los productos de la mejor calidad y a los mejores precios.
            </p>
          </div>

        <main>
          <section className="bg-white ">
              <div className="mt-10">
                <HomePage />
              </div>
          </section>

          <section className="bg-gray-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
              <h2 className="text-2xl font-bold">¿Listo para empezar?</h2>
              <p className="mt-2">Explora nuestra colección y encuentra lo que necesitas.</p>
              <Button className="mt-4 inline-block bg-white text-gray-800 font-bold py-2 px-4 rounded">
                <Link href="/dashboard">
                  Ir al Dashboard
                </Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Fragment>
  );
}

export default LandingPage;
