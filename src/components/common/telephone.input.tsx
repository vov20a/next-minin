'use client';

import React, { useEffect } from 'react';
import { Input } from '@heroui/react';
import { usePathname } from 'next/navigation';

interface IProps {
  setFormData: (phone: string) => void;
  initValue: string;
}

const TelephoneInput: React.FC<IProps> = ({ initValue, setFormData }) => {
  const [value, setValue] = React.useState('');
  const [mask, setMask] = React.useState('');

  const onMaskValue = (val: string) => {
    if (val.length < 10) {
      const regExp = /\d{1,9}/g;
      const v = regExp.exec(val);
      setValue(v === null ? '' : v[0]);
    } else if (val.length === 10) {
      const regExp1 = /\d{10}/g;
      const v = regExp1.exec(val);
      setValue(v === null ? '' : v[0]);

      const regExp = /^(\d{3})(\d{3})(\d{2})(\d{2})$/g;
      const result = regExp.exec(val);
      if (result) {
        setMask(`+7(${result[1]}) ${result[2]}-${result[3]}-${result[4]}`);
      }
    } else {
      const regExp = /^\+?7?\s?\(?\d{3}\)?\s?\d{3}[- ]?\d{2}[- ]?\d{2}$/g;
      const result = regExp.exec(val);

      if (result) {
        setMask(result[0]);
        setValue(result[0]);
        setFormData(result[0]);
      }
    }
  };
  useEffect(() => {
    if (value.length === 10) {
      setValue(mask);
      setFormData(mask);
      setMask('');
    }
    if (initValue === 'complete') {
      setValue('');
    }
  }, [mask, value, initValue, setValue, setMask, setFormData]);

  const pathname = usePathname();
  useEffect(() => {
    if (initValue !== undefined && pathname.includes('/edit')) {
      setValue(initValue);
    }
  }, [initValue, pathname]);

  return (
    <Input
      isRequired
      name="phone"
      type="tel"
      placeholder={'Enter your phone'}
      value={value}
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm focus:outline-none',
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onMaskValue(e.target.value);
      }}
      validate={(value) => {
        if (!value) return 'Телефон обязательно';
        return null;
      }}
    />
  );
};
export default TelephoneInput;

// <Input
//     isRequired
//     name="name"
//     placeholder="Введите название ингредиента"
//     type="text"
//     value={formData.name}
//     classNames={{
//       inputWrapper: 'bg-default-100',
//       input: 'text-sm focus:outline-none',
//     }}
//     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//     validate={(value) => {
//       if (!value) return 'Название обязательно';
//       return null;
//     }}
//   />
