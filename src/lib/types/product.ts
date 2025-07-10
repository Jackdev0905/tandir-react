import {
  ProductCollection,
  ProductSize,
  ProductStatus,
} from "../enums/product.enum";
import { CartItem } from "./search";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productSize: ProductSize;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productVolume: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  search?: string;
  productCollection?: ProductCollection;
}

export interface ProductProps {
  onAdd: (item: CartItem) => void;
}
