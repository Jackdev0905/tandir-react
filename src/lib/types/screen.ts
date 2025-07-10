import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";

export interface AppRootState{
    homePage: HomePageState,
    productsPage: ProductsPageState,
    ordersPage: OrdersPageState
}

export interface HomePageState{
    topUsers:Member[],
    popularDishes:Product[],
    newDishes:Product[],
}

export interface ProductsPageState{
    restaurant: Member | null,
    chosenProduct: Product | null,
    products: Product[]
}

export interface OrdersPageState{
    pausedOrders:Order[],
    processOrders:Order[],
    finishedOrders:Order[],
}