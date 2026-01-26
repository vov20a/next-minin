'use client';

import { limitOrders } from '@/config/pagesContent';
import { getNachinkyLabel, getTortsLabel } from '@/constants/select-options';
import { useAuthStore } from '@/store/auth.store';
import { useOrderStore } from '@/store/order.store';
import {
  addToast,
  Alert,
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

const OrdersTable = () => {
  const [error, setError] = useState<string | null>(null);
  const { orders, loadOrders, changeStatus, ordersCount, isLoading } = useOrderStore();
  const { isAuth } = useAuthStore();
  const ordersCnt = useOrderStore((state) => state.orderCount);
  const totalPrice = useOrderStore((state) => state.totalPrice);

  const limit = limitOrders;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPage, setCountPage] = useState<number>(Math.ceil(ordersCnt / limit));

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMounted = useRef<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (isMounted.current) {
      loadOrders(currentPage);
      setCountPage(Math.ceil(ordersCnt / limit));

      router.push(
        pathname +
          '?' +
          // `${currentPage > 1 ? createQueryString('page', currentPage.toString()) : ''}`,
          createQueryString('page', currentPage.toString()),
      );
    } else if (!isMounted.current) {
      setCurrentPage(Number(searchParams.get('page')) !== 0 ? Number(searchParams.get('page')) : 1);
      ordersCount();
    }
    isMounted.current = true;
  }, [
    isMounted.current,
    currentPage,
    ordersCnt,
    countPage,
    createQueryString,
    limit,
    loadOrders,
    orders.length,
    ordersCount,
    pathname,
    router,
    searchParams,
  ]);

  const handleChangeStatus = async (id: string, status: boolean) => {
    startTransition(async () => {
      await changeStatus(id, status);
      const storeError = useOrderStore.getState().error;
      if (storeError) {
        setError(storeError);
        addToast({ title: storeError, color: 'danger' });
      } else {
        setError(null);
        addToast({ title: 'Status changed', color: 'success' });
        orders.forEach((order) => {
          if (order.id === id) {
            const sts = order.status;
            order.status = !sts;
          }
        });
      }
    });
  };

  if (!isAuth) {
    return <p>Не авторизован</p>;
  }

  return !isLoading ? (
    <>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {ordersCnt ? (
        <>
          <div className="flex items-center justify-between w-full max-sm:flex-col max-sm:gap-5 ">
            <div className="w-1/3 max-sm:w-full">
              <Alert color="success" radius="md" title="Кол-во заказов" description={ordersCnt} />
            </div>
            <div className="w-1/3  max-sm:w-full">
              <Alert color="success" radius="md" title="Общая сумма" description={totalPrice} />
            </div>
          </div>
          <Table
            aria-label="Список ингредиентов"
            classNames={{
              wrapper: 'mt-4',
              table: 'w-full',
              th: 'text-black',
              td: 'text-black',
            }}
          >
            <TableHeader>
              <TableColumn>№</TableColumn>
              <TableColumn>Фамилия</TableColumn>
              <TableColumn>Начинка</TableColumn>
              <TableColumn>Торты</TableColumn>
              <TableColumn>Вес гр</TableColumn>
              <TableColumn>Цена ₽</TableColumn>
              <TableColumn>Описание</TableColumn>
              <TableColumn>Доставка</TableColumn>
              <TableColumn>Телефон</TableColumn>
              <TableColumn>Заказ на</TableColumn>
              <TableColumn>Действия</TableColumn>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className={
                    order.status
                      ? 'bg-blue-300 border-1 border-blue-400'
                      : 'bg-yellow-100 border-1 border-amber-300'
                  }
                >
                  <TableCell>{index + 1 + (currentPage - 1) * limit}.</TableCell>
                  <TableCell className=" max-sm:text-[10px]">{order.name}</TableCell>
                  <TableCell className="max-w-35 text-[10px]">
                    {getNachinkyLabel(order.nachinka)}
                  </TableCell>
                  <TableCell className="max-w-50 text-[10px]">
                    {getTortsLabel(order.tort)}
                  </TableCell>
                  <TableCell className=" max-sm:text-[10px]">{order.weight}</TableCell>
                  <TableCell>
                    {order.pricePerUnit !== null ? `${order.pricePerUnit}` : '-'}
                  </TableCell>
                  <TableCell className=" max-sm:text-[10px]">{order.description || '--'}</TableCell>
                  <TableCell className=" max-sm:text-[10px]">{order.address || '--'}</TableCell>
                  <TableCell className=" max-sm:text-[10px]">{order.phone}</TableCell>
                  <TableCell className=" max-sm:text-[10px]">{order.orderDate}</TableCell>
                  <TableCell className="flex flex-col gap-0.5">
                    <Link href={`/orders/${order.id}`}>
                      <Button color="primary" size="sm">
                        Открыть
                      </Button>
                    </Link>
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => handleChangeStatus(order.id, order.status)}
                      disabled={isPending}
                    >
                      Статус
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <p>Нет заказов</p>
      )}
      {countPage > 1 && (
        <div className="flex justify-center items-center my-2">
          <Pagination
            showControls={true}
            initialPage={currentPage}
            total={countPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </>
  ) : (
    <div className="mt-4 flex w-full justify-center">
      <Spinner size="lg" />
    </div>
  );
};

export default OrdersTable;
