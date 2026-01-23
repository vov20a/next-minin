import { createPrice, deletePrice, editPrice } from '@/actions/price';

import { IPrice } from '@/types/price';
import { create } from 'zustand';

interface PriceState {
  //   orders: IOrder[];
  price: IPrice;
  isLoading: boolean;
  error: string | null;
  //   orderCount: number;
  //   limit: number;
  //   page: number;
  //   loadOrders: (page: number) => Promise<void>;
  //   loadOrder: (id: string) => Promise<void>;
  addPrice: (formData: FormData) => Promise<void>;
  updatePrice: (formData: FormData, id: string) => Promise<void>;
  removePrice: (id: string) => Promise<void>;
}

export const usePriceStore = create<PriceState>((set) => ({
  //   orders: [],
  price: {} as IPrice,
  isLoading: false,
  error: null,

  addPrice: async (formData: FormData) => {
    set({ error: null });

    try {
      const result = await createPrice(formData);
      if (result.success) {
        set((state) => ({
          //   orders: [...state.orders, result.order],
          price: result.price,
          isLoading: false,
        }));
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('error', error);
      set({ error: 'Ошибка при добавлении заказа', isLoading: false });
    }
  },

  updatePrice: async (formData: FormData, id: string) => {
    set({ error: null });

    try {
      const result = await editPrice(formData, id);
      if (result.success && result.price) {
        set((state) => ({
          price: result.price,
          isLoading: false,
        }));
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('error', error);
      set({ error: 'Ошибка при обновлении суммы', isLoading: false });
    }
  },

  removePrice: async (id: string) => {
    set({ error: null });

    try {
      const result = await deletePrice(id);

      if (result.success) {
        set((state) => ({
          // orders: state.orders.filter((order) => order.id !== id),
          isLoading: false,
          // orderCount: result.orderCount,
        }));
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('error', error);
      set({ error: 'Ошибка при удалении price', isLoading: false });
    }
  },
}));
