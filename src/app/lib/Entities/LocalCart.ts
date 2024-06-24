import { OrderItem } from "./Order";

export interface LocalCart {
    products: OrderItem[];
    totalPrice: number;
    id: string;
    totalprice: number;
    creationdate: Date;
    mercadopagoid?: string;
  }