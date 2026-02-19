'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  calcPriceForTort,
  getTortsLabel,
  NACHINKY_OPTIONS,
  TORTS_OPTIONS,
} from '@/constants/select-options';
import { useOrderStore } from '@/store/order.store';
import { addToast, Button, Checkbox, Form, Input, Select, SelectItem } from '@heroui/react';
import { useEffect, useState, useTransition } from 'react';
import TelephoneInput from '@/components/common/telephone.input3';
import DateInput from '@/components/common/date.input';
import { IOrderInit } from '@/types/order';
import AddressInput from '@/components/common/address.input';
import PriceModal from '@/components/UI/modals/price.modal';

const OrderEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isAddressError, setIsAddressError] = useState<boolean>(false);
  const [isDateError, setIsDateError] = useState<boolean>(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [isPendingOrder, startTransitionOrder] = useTransition();

  const { order: oldOrder, loadOrder, updateOrder } = useOrderStore();

  useEffect(() => {
    loadOrder(id);
  }, [id, loadOrder]);

  const initialState: IOrderInit = {} as IOrderInit;
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setIsDelivery(!oldOrder.address ? false : true);
    if (oldOrder.address !== undefined)
      setFormData({
        name: oldOrder.name,
        nachinka: oldOrder.nachinka,
        tort: oldOrder.tort,
        pricePerUnit: oldOrder.pricePerUnit,
        weight: oldOrder.weight,
        description: oldOrder.description,
        address: oldOrder.address,
        orderDate: oldOrder.orderDate,
        phone: oldOrder.phone,
        priceId: oldOrder.priceId,
        status: oldOrder.status,
      });
    setIsStatus(oldOrder.status);
  }, [oldOrder]);

  const handleSubmit = async (formData: FormData) => {
    startTransitionOrder(async () => {
      await updateOrder(formData, id);
      const storeError = useOrderStore.getState().error;
      if (storeError) {
        setError(storeError);
        addToast({ title: storeError, color: 'danger' });
      } else {
        setError(null);
        setIsDelivery(false);
        setFormData({
          ...initialState,
          phone: 'complete',
        });

        addToast({ title: 'Order updated', color: 'success' });
        router.push('/orders');
      }
    });
  };

  return (
    <>
      <p className=" mb-4">Редактирование заказа: {oldOrder.name}</p>
      <Form className="w-full " action={handleSubmit}>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex flex-col w-[20%]">
          <Checkbox
            isSelected={isStatus}
            onChange={(e) => {
              setFormData({ ...formData, status: e.target.checked });
              setIsStatus(e.target.checked);
            }}
          >
            Статус
          </Checkbox>
          <Input
            name="status"
            type="text"
            value={`${formData.status}`}
            classNames={{
              inputWrapper: ' hidden',
              input: 'text-sm focus:outline-none ',
            }}
          />
        </div>
        <div className="flex gap-2 w-full">
          <Input
            isRequired
            name="name"
            placeholder="Введите фамилию покупателя"
            type="text"
            value={formData.name}
            classNames={{
              inputWrapper: 'bg-default-100',
              input: 'text-sm focus:outline-none',
            }}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            validate={(value) => {
              if (!value) return 'Название обязательно';
              return null;
            }}
          />
        </div>
        <div className="flex gap-2 w-full">
          <Input
            name="description"
            placeholder="Введите описание (необязательно)"
            type="text"
            value={formData.description ?? ''}
            classNames={{
              inputWrapper: 'bg-default-100',
              input: 'text-sm focus:outline-none',
            }}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex gap-2 w-full max-sm:flex-col">
          <div className="w-[35%] max-sm:w-full">
            <Select
              isRequired
              name="nachinka"
              placeholder="Начинка"
              selectedKeys={formData.nachinka ? [formData.nachinka] : []}
              classNames={{
                trigger: 'bg-default-100 w-full',
                innerWrapper: 'text-sm',
                value: 'truncate',
                selectorIcon: 'text-black',
              }}
              onChange={(e) => setFormData({ ...formData, nachinka: e.target.value })}
            >
              {NACHINKY_OPTIONS.map((option) => (
                <SelectItem key={option.value} className="text-black">
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-[35%] max-sm:w-full">
            <Select
              isRequired
              disabledKeys={
                formData.priceId === ''
                  ? []
                  : TORTS_OPTIONS.filter((item) => item.value !== formData.tort).map((item) => {
                      return item.value;
                    })
              }
              name="tort"
              placeholder="Торт"
              selectedKeys={formData.tort ? [formData.tort] : []}
              classNames={{
                trigger: 'bg-default-100 w-full',
                innerWrapper: 'text-sm',
                value: 'truncate',
                selectorIcon: 'text-black',
              }}
              onChange={(e) => {
                if (formData.priceId === '')
                  setFormData({ ...formData, tort: e.target.value, priceId: '' });
              }}
            >
              {TORTS_OPTIONS.map((option) => (
                <SelectItem key={option.value} className="text-black">
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {formData.tort !== '' && formData.tort !== null && (
            <>
              <div className="w-[15%]  max-sm:w-full">
                <Input
                  isRequired
                  name="weight"
                  placeholder="Вес"
                  type="number"
                  value={formData.weight?.toString()}
                  classNames={{
                    inputWrapper: 'bg-default-100',
                    input: 'text-sm focus:outline-none',
                  }}
                  endContent={
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                      Гр
                    </span>
                  }
                  validate={(value) => {
                    if (!value) return 'Вес обязательно';
                    const num = parseFloat(value);
                    if (isNaN(num) || num < 0) return 'Вес должна быть положительный';
                    return null;
                  }}
                />
              </div>
              <div className="w-[15%]  max-sm:w-full">
                <Input
                  isRequired
                  name="pricePerUnit"
                  placeholder="Цена"
                  type="number"
                  value={formData.pricePerUnit?.toString()}
                  classNames={{
                    inputWrapper: 'bg-default-100',
                    input: 'text-sm focus:outline-none',
                  }}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : null;
                    setFormData({ ...formData, pricePerUnit: value });
                  }}
                  endContent={
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                      ₽
                    </span>
                  }
                  validate={(value) => {
                    if (!value) return 'Цена обязательна';
                    const num = parseFloat(value);
                    if (isNaN(num) || num < 0) return 'Цена должна быть положительной';
                    return null;
                  }}
                />
              </div>
            </>
          )}
        </div>
        {formData.tort !== '' && (
          <div className="flex w-full items-center justify-end">
            <Button
              color={'primary'}
              disabled={formData.tort !== '' ? false : true}
              type="button"
              onPress={() => setIsPriceOpen(true)}
            >
              Редактировать
            </Button>
          </div>
        )}

        {isDelivery ? (
          <AddressInput
            formData={formData}
            setFormData={setFormData}
            isAddressError={isAddressError}
            setIsAddressError={setIsAddressError}
          />
        ) : (
          <Input
            name="address"
            type="text"
            value={''}
            classNames={{
              inputWrapper: 'bg-default-100 hidden',
              input: 'text-sm focus:outline-none ',
            }}
          />
        )}

        <div className=" flex w-full items-center justify-center rounded-2xl  bg-default-100 text-default-500">
          <TelephoneInput
            initValue={oldOrder.phone}
            setFormData={(phone) => setFormData({ ...formData, phone: phone })}
          />
        </div>

        <div className="flex flex-col gap-4 w-full bg-gray-100 border-1 rounded-2xl">
          <DateInput
            formData={formData}
            setFormData={setFormData}
            setIsDateError={setIsDateError}
            isDateError={isDateError}
          />
        </div>

        <div className="flex w-full items-center justify-end">
          <Button
            color="primary"
            type="submit"
            isLoading={isPendingOrder}
            onPress={() =>
              (!formData.address && setIsAddressError(true)) ||
              (!formData.orderDate && setIsDateError(true))
            }
          >
            Обновить заказ
          </Button>
        </div>
        <Input
          name="priceId"
          type="text"
          hidden={true}
          value={formData.priceId !== null ? formData.priceId : ''}
          classNames={{
            inputWrapper: 'bg-default-100 hidden',
            input: 'text-sm focus:outline-none ',
          }}
        />
      </Form>
      <PriceModal
        setFormData={(weight: number, price: number) =>
          setFormData({ ...formData, weight: weight, pricePerUnit: price })
        }
        priceForTort={() => calcPriceForTort(formData.tort, setFormData, formData)}
        setIsDelivery={setIsDelivery}
        isOpen={isPriceOpen}
        onClose={() => setIsPriceOpen(false)}
        setIsPriceOpen={setIsPriceOpen}
        setPriceId={(value: string) => setFormData({ ...formData, priceId: value })}
        tortTitle={getTortsLabel(formData.tort)}
        price={oldOrder.price ?? undefined}
        weight={oldOrder.weight ?? undefined}
      />
    </>
  );
};

export default OrderEditForm;
