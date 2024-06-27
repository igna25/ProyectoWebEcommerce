import React, { Fragment } from 'react';
import ProductsRepository from "../lib/Repositories/ProductsRepository";
import ProductListDashboard from "../ui/dashboard/productListDasboard";
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/auth-config';

const HomePage = async () => {
  const productsRepository = new ProductsRepository();

  const recentlyAddedProducts = await productsRepository.getRecentlyAddedProducts();
  const topSellingProducts = await productsRepository.getTopSellingProducts();

  const session: Session | null = await getServerSession(authOptions);
  return (
    <Fragment>
      <div className="mx-auto max-w-7xl py-4">
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Productos Añadidos Recientemente</h2>
          <ProductListDashboard products={recentlyAddedProducts} userId={session?.user.id} />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Productos Más Vendidos</h2>
          <ProductListDashboard products={topSellingProducts} userId={session?.user.id}/>
        </section>
      </div>
    </Fragment>
  );
}

export default HomePage;
