import { Product } from "../Entities/Product";
import { OrderItem } from "../Entities/Order";

export async function addProductToLocalStorage(product: Product) {
  const currentCart: (OrderItem & Product)[] = JSON.parse(
    localStorage.getItem("cart") || "[]",
  );

  const existingProductIndex = currentCart.findIndex(
    (item: OrderItem & Product) => item.productid == product.id,
  );

  if (existingProductIndex !== -1) {
    currentCart[existingProductIndex].quantity++;
  } else {
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
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(currentCart));
}
