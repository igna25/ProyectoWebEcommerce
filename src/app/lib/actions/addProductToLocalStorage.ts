import { Product } from '@/app/lib/Entities/Product';

export async function addProductToLocalStorage(product: Product){
    // Obtener el carrito actual del local storage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = currentCart.findIndex((item: Product) => item.id === product.id);

    if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        currentCart[existingProductIndex].quantity++;
    } else {
        // Si el producto no está en el carrito, agregarlo con una cantidad de 1
        currentCart.push({ product, quantity: 1 });
    }

    // Guardar el carrito actualizado en el local storage
    localStorage.setItem('cart', JSON.stringify(currentCart));
};
