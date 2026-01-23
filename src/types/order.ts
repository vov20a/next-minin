import { IPrice } from './price';

export interface IOrderInit {
  name: string;
  nachinka: string;
  tort: string;
  pricePerUnit: number | null;
  weight: number | null;
  description: string | null;
  address: string | undefined | null;
  phone: string;
  orderDate: string;
  priceId: string | null;
  status: boolean;
}
export interface IOrder extends IOrderInit {
  id: string;
  price?: IPrice | undefined | null;
  createdAt?: Date;
  updatedAt?: Date;
}
