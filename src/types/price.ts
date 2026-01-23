// import { IOrder } from './order';

export interface IPriceInit {
  totalAmount: number | null;
  priceForKg: number | null;
  weight: number | null;
  package: number | null;
  cover: number | null;
  fruit: number | null;
  figure: number | null;
  delivery: number | null;
  others: number | null;
}
export interface IPrice {
  id: string;
  totalAmount: number | null;
  package: number | null;
  cover: number | null;
  fruit: number | null;
  figure: number | null;
  delivery: number | null;
  others: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}
