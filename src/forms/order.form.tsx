'use client';

import {
  calcPriceForTort,
  getTortsLabel,
  NACHINKY_OPTIONS,
  TORTS_OPTIONS,
} from '@/constants/select-options';
import { useOrderStore } from '@/store/order.store';
import { addToast, Button, Checkbox, Form, Input, Select, SelectItem } from '@heroui/react';
import { useState, useTransition } from 'react';
import TelephoneInput from '@/components/common/telephone.input';
import DateInput from '@/components/common/date.input';
import { IOrderInit } from '@/types/order';
import AddressInput from '@/components/common/address.input';
import { useRouter } from 'next/navigation';
import PriceModal from '@/components/UI/modals/price.modal';
import { usePriceStore } from '@/store/price.store';

const initialState: IOrderInit = {
  name: '',
  nachinka: '',
  tort: '',
  pricePerUnit: null,
  weight: null,
  description: '',
  address: '',
  phone: '',
  orderDate: '',
  priceId: '',
  status: false,
};

const OrderForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isAddressError, setIsAddressError] = useState<boolean>(false);
  const [isDateError, setIsDateError] = useState<boolean>(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isStatus, setIsStatus] = useState(false);

  const [formData, setFormData] = useState(initialState);
  const { addOrder } = useOrderStore();
  const { removePrice } = usePriceStore();
  const [isPendingOrder, startTransitionOrder] = useTransition();
  const [isPendingPrice, startTransitionPrice] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    // e.preventDefault();
    // console.log(formData);

    startTransitionOrder(async () => {
      await addOrder(formData);
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
        addToast({ title: 'Order created', color: 'success' });
        router.push('/orders');
      }
    });
  };

  const handleDeletePrice = async (id: string) => {
    startTransitionPrice(async () => {
      await removePrice(id);
      const storeError = usePriceStore.getState().error;
      if (storeError) {
        setError(storeError);
        addToast({ title: storeError, color: 'danger' });
      } else {
        setError(null);
        setFormData({ ...formData, priceId: '', weight: null, pricePerUnit: null });
        addToast({ title: 'Price deleted', color: 'success' });
        router.refresh();
      }
    });
  };

  return (
    <>
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
            value={formData?.description ?? ''}
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
                  value={formData.weight !== null ? formData.weight.toString() : ''}
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
                  value={formData.pricePerUnit !== null ? formData.pricePerUnit.toString() : ''}
                  classNames={{
                    inputWrapper: 'bg-default-100',
                    input: 'text-sm focus:outline-none',
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
        {formData.priceId === '' ? (
          <div className="flex w-full items-center justify-end">
            <Button
              color={formData.tort !== '' ? 'primary' : 'warning'}
              disabled={formData.tort !== '' ? false : true}
              type="button"
              onPress={() => setIsPriceOpen(true)}
            >
              {formData.tort !== '' ? 'Рассчитать сумму' : 'Отключено'}
            </Button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-end">
            <Button
              color={'danger'}
              type="button"
              isLoading={isPendingPrice}
              onPress={() => handleDeletePrice(formData.priceId !== null ? formData.priceId : '')}
            >
              Удалить сумму
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
            initValue={formData.phone}
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
            Добавить заказ
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
      />
    </>
  );
};

export default OrderForm;
