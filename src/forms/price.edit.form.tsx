import { usePriceStore } from '@/store/price.store';
import { IPrice, IPriceInit } from '@/types/price';
import { addToast, Button, Form, Input } from '@heroui/react';
import { Dispatch, SetStateAction, useEffect, useState, useTransition } from 'react';

interface IProps {
  setFormDataOrder: (weight: number, price: number) => void;
  priceForTort: () => number;
  setIsDelivery: Dispatch<SetStateAction<boolean>>;
  setIsPriceOpen: Dispatch<SetStateAction<boolean>>;
  setPriceId: (value: string) => void;
  oldPrice: IPrice;
  weight: number | undefined;
}
const initialState: IPriceInit = {
  totalAmount: null,
  priceForKg: null,
  weight: null,
  package: null,
  cover: null,
  fruit: null,
  figure: null,
  delivery: null,
  others: null,
};

const PriceEditForm = ({
  setFormDataOrder,
  priceForTort,
  setIsDelivery,
  setIsPriceOpen,
  setPriceId,
  oldPrice,
  weight,
}: IProps) => {
  const [formData, setFormData] = useState(initialState);
  const [amount, setAmount] = useState(initialState.totalAmount);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const { updatePrice } = usePriceStore();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await updatePrice(formData, oldPrice.id);
      const storeError = usePriceStore.getState().error;
      if (storeError) {
        setError(storeError);
        addToast({ title: storeError, color: 'danger' });
      } else {
        setError(null);
        const delivery = usePriceStore.getState().price.delivery;
        setIsDelivery(delivery !== null ? true : false);
        const priceId = usePriceStore.getState().price.id;
        setPriceId(priceId);

        addToast({ title: 'Prices created', color: 'success' });
        setIsPriceOpen(false);
      }
    });
  };

  useEffect(() => {
    const sum = () => {
      const price =
        !Number.isNaN(formData.weight) && formData.weight !== null
          ? (formData.weight * priceForTort()) / 1000
          : 0;
      const cover = !Number.isNaN(formData.cover) && formData.cover !== null ? formData.cover : 0;
      const pack = !Number.isNaN(formData.package) && formData.package ? formData.package : 0;
      const fruit = !Number.isNaN(formData.fruit) && formData.fruit ? formData.fruit : 0;
      const figure = !Number.isNaN(formData.figure) && formData.figure ? formData.figure : 0;
      const delivery =
        !Number.isNaN(formData.delivery) && formData.delivery ? formData.delivery : 0;
      const others = !Number.isNaN(formData.others) && formData.others ? formData.others : 0;

      const totalAmount = price + cover + pack + fruit + figure + delivery + others;

      setAmount(totalAmount);
    };
    if (formData === initialState) {
      const priceForKilo = priceForTort();
      setFormData({
        totalAmount: oldPrice.totalAmount,
        weight: weight ?? null,
        package: oldPrice.package,
        fruit: oldPrice.fruit,
        figure: oldPrice.figure,
        cover: oldPrice.cover,
        delivery: oldPrice.delivery,
        others: oldPrice.others,
        priceForKg: priceForKilo,
      });
    } else {
      sum();
      if (formData.delivery !== null && formData.delivery > 0) {
        setIsDelivery(true);
      } else {
        setIsDelivery(false);
      }
    }
  }, [
    formData,
    oldPrice.cover,
    oldPrice.delivery,
    oldPrice.figure,
    oldPrice.fruit,
    oldPrice.others,
    oldPrice.package,
    oldPrice.totalAmount,
    // priceForTort,
    setIsDelivery,
    weight,
  ]);
  return (
    <Form className="w-full " action={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-nowrap w-full">
        <div className="w-1/2 px-3  max-sm:px-1">
          <div className="w-full pb-1">
            <Input
              isRequired
              name="weight"
              label="Вес"
              type="number"
              value={formData.weight !== null ? formData.weight.toString() : ''}
              classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm focus:outline-none',
                label: 'max-sm:text-[10px] max-sm:leading-tight',
              }}
              onChange={(e) => {
                setFormData({ ...formData, weight: parseFloat(e.target.value) });
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
          <div className="w-full pb-1">
            <Input
              isRequired
              readOnly
              name="priceForKg"
              label="Цена за 1кг"
              type="number"
              value={formData.priceForKg !== null ? formData.priceForKg.toString() : ''}
              classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm focus:outline-none',
                label: 'max-sm:text-[10px] max-sm:leading-tight',
              }}
              endContent={
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                  ₽
                </span>
              }
              validate={(value) => {
                if (!value) return 'Цена обязательно';
                const num = parseFloat(value);
                if (isNaN(num) || num < 0) return 'Цена должна быть положительной';
                return null;
              }}
            />
          </div>
          <div className="w-full pb-1">
            <Input
              label="Упаковка"
              isRequired
              name="package"
              type="number"
              value={
                formData.package !== null && formData.package !== 0
                  ? formData.package.toString()
                  : ''
              }
              classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm focus:outline-none',
                label: 'max-sm:text-[10px] max-sm:leading-tight',
              }}
              onChange={(e) => {
                setFormData({ ...formData, package: parseFloat(e.target.value) });
              }}
              endContent={
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                  ₽
                </span>
              }
              validate={(value) => {
                if (!value) return 'Упаковка обязательно';
                const num = parseFloat(value);
                if (isNaN(num) || num < 0) return 'Упаковка обязательно';
                return null;
              }}
            />
          </div>
          <div className="w-full pb-1">
            <Input
              label="Покрытие (необязательно)"
              name="cover"
              type="number"
              value={formData.cover !== null ? formData.cover.toString() : ''}
              classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm focus:outline-none',
                label: 'max-sm:text-[10px] max-sm:leading-tight',
              }}
              onChange={(e) => {
                setFormData({ ...formData, cover: parseFloat(e.target.value) });
              }}
              endContent={
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                  ₽
                </span>
              }
            />
          </div>
          <div className="w-full pb-1">
            <Input
              name="fruit"
              label="Фрукты (необязательно)"
              type="number"
              value={formData.fruit !== null ? formData.fruit.toString() : ''}
              classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm focus:outline-none',
                label: 'max-sm:text-[10px] max-sm:leading-tight',
              }}
              onChange={(e) => {
                setFormData({ ...formData, fruit: parseFloat(e.target.value) });
              }}
              endContent={
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                  ₽
                </span>
              }
            />
          </div>
        </div>
        <div className="w-1/2 px-3  max-sm:px-1">
          <div className="w-full pb-1">
            <Input
              name="figure"
              label="Фигурки (необязательно)"
              type="number"
              value={formData.figure !== null ? formData.figure.toString() : ''}
              classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm focus:outline-none',
                label: 'max-sm:text-[10px] max-sm:leading-tight',
              }}
              onChange={(e) => {
                setFormData({ ...formData, figure: parseFloat(e.target.value) });
              }}
              endContent={
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                  ₽
                </span>
              }
            />
          </div>
          <div className="w-full pb-1">
            <Input
              name="delivery"
              label="Доставка (необязательно)"
              type="number"
              value={formData.delivery !== null ? formData.delivery.toString() : ''}
              classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm focus:outline-none',
                label: 'max-sm:text-[10px] max-sm:leading-tight',
              }}
              onChange={(e) => {
                setFormData({ ...formData, delivery: parseFloat(e.target.value) });
              }}
              endContent={
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                  ₽
                </span>
              }
            />
          </div>
          <div className="w-full pb-1">
            <Input
              name="others"
              label="Другие расходы (необязательно)"
              type="number"
              value={formData.others !== null ? formData.others.toString() : ''}
              classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm focus:outline-none',
                label: 'max-sm:text-[10px] max-sm:leading-tight',
              }}
              onChange={(e) => {
                setFormData({ ...formData, others: parseFloat(e.target.value) });
              }}
              endContent={
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                  ₽
                </span>
              }
            />
          </div>
          <div className="w-full pb-1">
            <Input
              isRequired
              name="totalAmount"
              label="Итого"
              type="number"
              value={amount !== null ? amount.toString() : ''}
              className="max-sm:min-w-1/3"
              classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm focus:outline-none',
                label: 'max-sm:text-[10px] max-sm:leading-tight',
              }}
              endContent={
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-default-500 pointer-events-none">
                  ₽
                </span>
              }
              validate={(value) => {
                if (!value) return 'Итого обязательно';
                const num = parseFloat(value);
                if (isNaN(num) || num < 0) return 'Цена должна быть положительный';
                return null;
              }}
            />
          </div>
          <div className="w-full pb-1">
            <Button
              className="mt-2 px-4"
              color="primary"
              type="submit"
              isLoading={isPending}
              onPress={() => {
                setFormData({ ...formData, totalAmount: amount });
                const weightOrder = formData.weight !== null ? formData.weight : 0;
                setFormDataOrder(weightOrder, amount !== null ? amount : 0);
              }}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default PriceEditForm;
