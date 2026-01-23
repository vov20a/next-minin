import { Input } from '@heroui/input';
import { Dispatch, SetStateAction, useState } from 'react';
import AddressModal from '../UI/modals/address.modal';
import { IOrderInit } from '@/types/order';

interface IProps {
  isAddressError: boolean;
  setIsAddressError: Dispatch<SetStateAction<boolean>>;
  setFormData: Dispatch<SetStateAction<IOrderInit>>;
  formData: IOrderInit;
}

const AddressInput: React.FC<IProps> = ({
  formData,
  setFormData,
  isAddressError,
  setIsAddressError,
}) => {
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);

  return (
    <>
      <div className=" flex w-full items-center justify-center rounded-2xl  bg-default-100 text-default-500">
        <Input
          isClearable
          isInvalid={isAddressError}
          errorMessage="Please enter a valid address"
          isRequired
          name="address"
          placeholder="Введите address"
          type="text"
          value={formData.address ?? ''}
          classNames={{
            inputWrapper: 'bg-default-100',
            input: 'text-sm focus:outline-none',
          }}
          onClick={() => setIsAddressOpen(true)}
          onClear={() => {
            setIsAddressError(true);
            setFormData({ ...formData, address: '' });
          }}
        />
      </div>
      <AddressModal
        setFormData={(value: string) => {
          setFormData({ ...formData, address: value });
          setIsAddressError(false);
        }}
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
      />
    </>
  );
};

export default AddressInput;
