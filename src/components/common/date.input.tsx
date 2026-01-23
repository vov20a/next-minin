'use client';

import { IOrderInit } from '@/types/order';
import { Input } from '@heroui/input';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DateModal from '../UI/modals/date.modal';

interface IProps {
  setFormData: Dispatch<SetStateAction<IOrderInit>>;
  formData: IOrderInit;
  isDateError: boolean;
  setIsDateError: Dispatch<SetStateAction<boolean>>;
}

export default function DateInput({ formData, setFormData, setIsDateError, isDateError }: IProps) {
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);

  return (
    <>
      <Input
        isClearable
        isInvalid={isDateError}
        errorMessage="Please enter a valid date"
        isRequired
        name="orderDate"
        placeholder={'Введите дату выдачи заказа'}
        type="text"
        value={formData.orderDate}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        onClick={() => setIsDateOpen(true)}
        onClear={() => {
          setIsDateError(true);
          setFormData({ ...formData, orderDate: '' });
        }}
      />
      <DateModal
        setFormData={(value: string) => {
          setFormData({ ...formData, orderDate: value });
          setIsDateError(false);
        }}
        isOpen={isDateOpen}
        onClose={() => setIsDateOpen(false)}
      />
    </>
  );
}
