'use client';

import DateChoise from '@/components/common/date.choise';
import CustomModal from '@/components/common/modal';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  setFormData: (value: string) => void;
}

const DateModal = ({ setFormData, isOpen, onClose }: IProps) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      minHeight="min-h-[220px]"
      title="Date Picker modal"
      size="xl"
      showFooter={true}
    >
      <DateChoise setFormData={setFormData} />
    </CustomModal>
  );
};

export default DateModal;
