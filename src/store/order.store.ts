import {
  createOrder,
  deleteOrder,
  editOrder,
  getOrder,
  getByOrderDate,
  getOrders,
  getOrdersCount,
  getTotalPrice,
  searchByName,
  searchByTort,
  getChangeStatus,
  searchByStatus,
} from '@/actions/order';
import { limitOrders } from '@/config/pagesContent';
import { IOrder } from '@/types/order';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TORT } from '@/generated/prisma';

interface OrderState {
  orders: IOrder[];
  foundOrders: IOrder[];
  order: IOrder;
  isLoading: boolean;
  error: string | null;
  orderCount: number;
  limit: number;
  page: number;
  totalPrice: number;
  filteredPrice: number;
  ordersCount: () => Promise<void>;
  loadOrders: (page: number) => Promise<void>;
  loadOrder: (id: string) => Promise<void>;
  addOrder: (formData: FormData) => Promise<void>;
  updateOrder: (formData: FormData, id: string) => Promise<void>;
  removeOrder: (id: string) => Promise<void>;
  changeStatus: (id: string, status: boolean) => Promise<void>;
  findByName: (name: string, page: number) => Promise<void>;
  findByTort: (tort: TORT, page: number) => Promise<void>;
  findByStatus: (status: boolean, page: number) => Promise<void>;
  findTotalPrice: () => Promise<void>;
  findByOrderDate: (orderDate: string, page: number) => Promise<void>;
  resetFoundOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  devtools((set) => ({
    orders: [],
    foundOrders: [],
    order: {} as IOrder,
    isLoading: false,
    error: null,
    orderCount: 0,
    limit: limitOrders,
    page: 1,
    totalPrice: 0,
    filteredPrice: 0,
    ordersCount: async () => {
      set({ isLoading: true, error: null });
      try {
        const result = await getOrdersCount();

        if (result.success) {
          set({ orderCount: result.ordersCount, isLoading: false });
        } else {
          set({ error: result.error, isLoading: false });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при загрузке ordersCount', isLoading: false });
      }
    },
    loadOrders: async (page) => {
      set({ isLoading: true, error: null, page: page });

      try {
        const result = await getOrders(page);

        if (result.success) {
          set({ orders: result.orders, isLoading: false });
        } else {
          set({ error: result.error, isLoading: false });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при загрузке orders', isLoading: false });
      }
    },
    loadOrder: async (id) => {
      set({ isLoading: true, error: null });

      try {
        const result = await getOrder(id);

        if (result.success && result.order) {
          set({ order: result.order, isLoading: false });
        } else {
          set({ error: result.error, isLoading: false });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при загрузке order', isLoading: false });
      }
    },
    addOrder: async (formData: FormData) => {
      set({ error: null });

      try {
        const result = await createOrder(formData);
        if (result.success) {
          set((state) => ({
            orders: [...state.orders, result.order],
            orderCount: state.orderCount + 1,
            totalPrice: state.totalPrice + (result.order.pricePerUnit ?? 0),
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

    updateOrder: async (formData: FormData, id: string) => {
      set({ error: null });

      try {
        const result = await editOrder(formData, id);
        if (result.success && result.order) {
          set(() => ({
            order: result.order,
            totalPrice: result.totalPrice.totalPrice?.pricePerUnit ?? 0,
            isLoading: false,
          }));
        } else {
          set({ error: result.error, isLoading: false });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при обновлении заказа', isLoading: false });
      }
    },

    removeOrder: async (id: string) => {
      set({ error: null });

      try {
        const result = await deleteOrder(id);

        if (result.success && result.price) {
          set((state) => ({
            orders: state.orders.filter((order) => order.id !== id),
            totalPrice: state.totalPrice - (result.order.pricePerUnit ?? 0),
            isLoading: false,
            orderCount: result.orderCount,
          }));
        } else {
          set({ error: result.error, isLoading: false, orderCount: 1 });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при удалении order', isLoading: false, orderCount: 1 });
      }
    },

    changeStatus: async (id: string, status: boolean) => {
      set({ error: null });
      try {
        const result = await getChangeStatus(id, status);
        if (result.success) {
          set(() => ({
            isLoading: false,
          }));
        } else {
          set({ error: result.error, isLoading: false, orderCount: 1 });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при изменении статуса', isLoading: false, orderCount: 1 });
      }
    },

    findByName: async (name, page: number) => {
      set({ isLoading: true, error: null, foundOrders: [] });

      try {
        const result = await searchByName(name, page);

        if (result.success) {
          set({
            foundOrders: result.orders,
            orderCount: result.orderCount,
            isLoading: false,
          });
        } else {
          set({ error: result.error, isLoading: false, foundOrders: [] });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при поиске по имени', isLoading: false, foundOrders: [] });
      }
    },
    findByTort: async (tort, page: number) => {
      set({ isLoading: true, error: null, foundOrders: [], filteredPrice: 0 });

      try {
        const result = await searchByTort(tort, page);

        if (result.success) {
          set({
            foundOrders: result.orders,
            orderCount: result.orderCount,
            filteredPrice: result.filteredPrice ?? 0,
            isLoading: false,
          });
        } else {
          set({ error: result.error, isLoading: false, foundOrders: [], filteredPrice: 0 });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при поиске по торту', isLoading: false, foundOrders: [] });
      }
    },
    findByStatus: async (status, page: number) => {
      set({ isLoading: true, error: null, foundOrders: [], filteredPrice: 0 });

      try {
        const result = await searchByStatus(status, page);

        if (result.success) {
          set({
            foundOrders: result.orders,
            orderCount: result.orderCount,
            filteredPrice: result.filteredPrice ?? 0,
            isLoading: false,
          });
        } else {
          set({ error: result.error, isLoading: false, foundOrders: [], filteredPrice: 0 });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при поиске по торту', isLoading: false, foundOrders: [] });
      }
    },
    resetFoundOrders: async () => {
      set({
        foundOrders: [],
        filteredPrice: 0,
      });
    },
    findByOrderDate: async (orderDate, page: number) => {
      set({ isLoading: true, error: null, foundOrders: [], filteredPrice: 0, page });

      try {
        const result = await getByOrderDate(orderDate, page);

        if (result.success) {
          set({
            filteredPrice: result.orderSumm ?? 0,
            foundOrders: result.orders,
            orderCount: result.orderCount,
            isLoading: false,
          });
        } else {
          set({ error: result.error, isLoading: false, foundOrders: [], filteredPrice: 0 });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при поиске по дате', isLoading: false, foundOrders: [] });
      }
    },

    findTotalPrice: async () => {
      set({ isLoading: true, error: null });
      try {
        const result = await getTotalPrice();

        if (result.success) {
          set({
            totalPrice: result.totalPrice.pricePerUnit ?? 0,
            isLoading: false,
          });
        } else {
          set({ error: result.error, isLoading: false, foundOrders: [] });
        }
      } catch (error) {
        console.error('error', error);
        set({ error: 'Ошибка при поиске по торту', isLoading: false, foundOrders: [] });
      }
    },
  })),
);

// export const ordersCount = () => useOrderStore((state) => state.orderCount);
