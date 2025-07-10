import { OrderStatus } from "../enums/order.enum";
import { Product } from "./product";

export interface OrderItem{
    _id: string;
    itemPrice: number;
    itemQuantity: number;
    productId: string;
    orderId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItemInput{
    itemPrice: number;
    itemQuantity: number;
    productId: string;
    orderId?: string;
}

export interface Order{
    _id: string;
    orderTotal:number;
    orderDelivery: number;
    orderStatus: OrderStatus;
    memberId:string;
    createdAt: Date;
    updatedAt: Date;
// order aggregation
    orderItems:OrderItem[];
    productData:Product[]
}

export interface OrderInquiry{
    page:number;
    limit:number;
    orderStatus:OrderStatus
}

export interface OrderUpdateInput{
    orderId:string;
    orderStatus: OrderStatus;
}