import { Product } from '@/app/lib/Entities/Product';
import { OrderItem } from '../Entities/Order';

export async function addProductToLocalStorage(product: Product) {
    // Obtener el carrito actual del local storage
    const currentCart: (OrderItem & Product)[] = JSON.parse(localStorage.getItem('cart') || '[]');

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = currentCart.findIndex((item: (OrderItem & Product)) => item.productid == product.id);

    if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        currentCart[existingProductIndex].quantity++;
    } else {
        // Si el producto no está en el carrito, agregarlo con una cantidad de 1
        currentCart.push({
            productid: product.id,
            cartid: "",
            productname: product.productname,
            productprice: product.price,
            price: product.price,
            id: "",
            imagekey: product.imagekey,
            imageurl: product.imageurl,
            dateadded: new Date(),
            description: product.description,
            active: product.active,
            stock: product.stock,
            publicationdate: product.publicationdate,
            quantity: 1
        });
    }

    // Guardar el carrito actualizado en el local storage
    localStorage.setItem('cart', JSON.stringify(currentCart));
}
