import CustomModal from '@/components/common/modal';
import PriceForm from '@/forms/price.form';
import { IPrice } from '@/types/price';
import { Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import PriceEditForm from '@/forms/price.edit.form';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  setFormData: (weight: number, price: number) => void;
  priceForTort: () => number;
  setIsDelivery: Dispatch<SetStateAction<boolean>>;
  setIsPriceOpen: Dispatch<SetStateAction<boolean>>;
  setPriceId: (value: string) => void;
  tortTitle: string;
  price?: IPrice;
  weight?: number;
}

const PriceModal = ({
  setFormData,
  priceForTort,
  setIsDelivery,
  isOpen,
  onClose,
  setIsPriceOpen,
  setPriceId,
  tortTitle,
  price = undefined,
  weight = undefined,
}: IProps) => {
  const pathname = usePathname();
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      maxHeight="max-h-[650px]"
      title={`Расчет цены ${tortTitle}`}
      size="2xl"
      showFooter={false}
    >
      {pathname.includes('edit') && price !== undefined ? (
        <PriceEditForm
          setFormDataOrder={setFormData}
          priceForTort={priceForTort}
          setIsDelivery={setIsDelivery}
          setIsPriceOpen={setIsPriceOpen}
          setPriceId={setPriceId}
          oldPrice={price}
          weight={weight}
        />
      ) : (
        <PriceForm
          setFormDataOrder={setFormData}
          priceForTort={priceForTort}
          setIsDelivery={setIsDelivery}
          setIsPriceOpen={setIsPriceOpen}
          setPriceId={setPriceId}
        />
      )}
    </CustomModal>
  );
};

export default PriceModal;
