'use client';

import { AddressChoise } from '@/components/common/address.choise';
import CustomModal from '@/components/common/modal';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  setFormData: (value: string) => void;
}

const AddressModal = ({ setFormData, isOpen, onClose }: IProps) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      minHeight="min-h-[600px] max-sm:min-h-[400px] max-sm:mt-[-100px]"
      title="Address modal"
      size="2xl"
      showFooter={true}
    >
      <AddressChoise setFormData={setFormData} />
    </CustomModal>
  );
};

export default AddressModal;
