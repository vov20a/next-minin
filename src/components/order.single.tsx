'use client';

import { getNachinkyLabel, getTortPrice, getTortsLabel } from '@/constants/select-options';
import { useAuthStore } from '@/store/auth.store';
import { useOrderStore } from '@/store/order.store';
import {
  addToast,
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

const OrderSingle = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { order, loadOrder, removeOrder, changeStatus, isLoading } = useOrderStore();
  const [error, setError] = useState<string | null>(null);
  const { isAuth } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    await removeOrder(id);
    const storeError = useOrderStore.getState().error;
    if (storeError) {
      setError(storeError);
      addToast({ title: storeError, color: 'danger' });
    } else {
      addToast({ title: 'Order deleted', color: 'success' });
      router.push('/orders');
    }
  };

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
        const sts = order.status;
        order.status = !sts;
      }
    });
  };

  useEffect(() => {
    loadOrder(id);
  }, [id]);

  return !isLoading && isAuth ? (
    <>
      <h1>Заказ {id}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
          <TableColumn>Опция</TableColumn>
          <TableColumn>Значение</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Button
                color="primary"
                size="sm"
                onPress={() => handleChangeStatus(order.id, order.status)}
                disabled={isPending}
              >
                Статус
              </Button>
            </TableCell>
            <TableCell>{order.status ? 'Выполнено' : 'В работе'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Фамилия</TableCell>
            <TableCell>{order.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Начинка</TableCell>
            <TableCell>{getNachinkyLabel(order.nachinka)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Торт</TableCell>
            <TableCell>{getTortsLabel(order.tort)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Вес</TableCell>
            <TableCell>{order.weight} гр</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Цена заказа</TableCell>
            <TableCell>{order.pricePerUnit} ₽</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Описание</TableCell>
            <TableCell>{order.description || '--'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Доставка</TableCell>
            <TableCell>{order.address || '--'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Телефон</TableCell>
            <TableCell>{order.phone}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Заказ на</TableCell>
            <TableCell>{order.orderDate}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {order.price && (
        <>
          <h1>Расчет стоимости</h1>
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
              <TableColumn>Опция</TableColumn>
              <TableColumn>Значение ₽</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Цена заказа</TableCell>
                <TableCell>{order.price.totalAmount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Цена 1кг торта</TableCell>
                <TableCell>{getTortPrice(order.tort)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Цена упаковки</TableCell>
                <TableCell>{order.price.package}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Цена покрытия</TableCell>
                <TableCell>{order.price.cover !== null ? `${order.price?.cover}` : '--'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Цена фруктов</TableCell>
                <TableCell>{order.price.fruit !== null ? `${order.price.fruit}` : '--'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Цена фигурок</TableCell>
                <TableCell>
                  {order.price.figure !== null ? `${order.price.figure}` : '--'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Стоимость доставки</TableCell>
                <TableCell>
                  {order.price.delivery !== null ? `${order.price.delivery}` : '--'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Другое</TableCell>
                <TableCell>
                  {order.price.others !== null ? `${order.price.others}` : '--'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell className="flex flex-wrap gap-3">
                  <Link href={`/orders/${order.id}/edit`}>
                    <Button color="primary" size="sm" className="mr-3">
                      Редактировать
                    </Button>
                  </Link>

                  <Button color="danger" size="sm" onPress={() => handleDelete(order.id)}>
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </>
  ) : (
    <div className="mt-4 flex w-full justify-center">
      <Spinner size="lg" />
    </div>
  );
};

export default OrderSingle;
