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
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import Link from 'next/link';
import React, { useEffect, useState, useTransition } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

const StatusArr: ('Выполнено' | 'В работе')[] = ['Выполнено', 'В работе'];

const ByStatusPage = () => {
  const [status, setStatus] = useState<string>(StatusArr[1]);
  const [error, setError] = useState<string | null>(null);
  const { foundOrders, orderCount, findByStatus, filteredPrice, resetFoundOrders, isLoading } =
    useOrderStore();
  const { isAuth } = useAuthStore();
  const [, startTransitionName] = useTransition();

  const limit = limitOrders;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPage, setCountPage] = useState<number>(1);

  const debounced = useDebounce(status, 500);
  const statusBoolean = debounced === 'В работе' ? false : true;

  const handleSearchByName = async () => {
    startTransitionName(async () => {
      if (debounced?.length > 2) {
        findByStatus(statusBoolean, currentPage);
      }

      const storeError = useOrderStore.getState().error;
      if (storeError) {
        setError(storeError);
        addToast({ title: storeError, color: 'danger' });
      } else {
        setError(null);
        addToast({ title: 'Finding completed', color: 'success' });
        setCountPage(Math.ceil(orderCount / limit));
      }
    });
  };

  useEffect(() => {
    if (currentPage > 1 && orderCount < limit * (currentPage - 1)) {
      setCurrentPage(1);
    }
    if (debounced?.length > 2) {
      handleSearchByName();
    }
    return () => {
      resetFoundOrders();
    };
  }, [currentPage, orderCount, debounced, limit, resetFoundOrders]);

  if (!isAuth) {
    return <p className="text-white">Не авторизован</p>;
  }

  return (
    <>
      <div className="flex w-full flex-wrap  justify-between mb-6 max-md:mb-0 gap-4">
        <Select
          isRequired
          label="Поиск по статусу"
          labelPlacement="inside"
          name="tort"
          className="w-[40%] max-md:w-full "
          defaultSelectedKeys={status}
          selectedKeys={[status]}
          classNames={{
            trigger: 'bg-default-100 w-full',
            innerWrapper: 'text-sm',
            value: 'truncate',
            selectorIcon: 'text-black',
          }}
          // onSelectionChange={setTort}
          onChange={(e) => setStatus(e.target.value as unknown as 'Выполнено' | 'В работе')}
          endContent={
            !isLoading ? (
              <></>
            ) : (
              <div className=" flex items-center">
                <Spinner size="md" />
              </div>
            )
          }
        >
          {StatusArr.map((option) => (
            <SelectItem key={option} className="text-black">
              {option}
            </SelectItem>
          ))}
        </Select>
        <div className="w-1/3 max-md:w-full">
          <Alert
            color="success"
            radius="md"
            title="Сумма ВСЕХ найденных заказов"
            description={filteredPrice}
          />
        </div>
      </div>
      {foundOrders.length > 0 && !isLoading ? (
        <>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {orderCount ? (
            <>
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
                  {foundOrders.map((order, index) => (
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
                      <TableCell className=" max-sm:text-[10px]">
                        {order.pricePerUnit !== null ? `${order.pricePerUnit}` : '-'}
                      </TableCell>
                      <TableCell className=" max-sm:text-[10px]">
                        {order.description || '--'}
                      </TableCell>
                      <TableCell className=" max-sm:text-[10px]">{order.address || '--'}</TableCell>
                      <TableCell className=" max-sm:text-[10px]">{order.phone}</TableCell>
                      <TableCell className=" max-sm:text-[10px]">{order.orderDate}</TableCell>
                      <TableCell>
                        <Link href={`/orders/${order.id}`}>
                          <Button color="primary" size="sm">
                            Открыть
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <div className="mt-4 flex w-full justify-center">Ничего не найдено</div>
          )}
        </>
      ) : (
        <div className="mt-4 flex w-full justify-center">Нет заказов</div>
      )}
    </>
  );
};

export default ByStatusPage;
