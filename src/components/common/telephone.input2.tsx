'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@heroui/react';
import { usePathname } from 'next/navigation';

interface IProps {
  setFormData: (phone: string) => void;
  initValue: string | undefined;
}

const TelephoneInput: React.FC<IProps> = ({ initValue, setFormData }) => {
  const refPhone = useRef<HTMLInputElement | null>(null);

  const [value, setValue] = useState('');
  const posArr: number[] = [3, 4, 5, 8, 9, 10, 12, 13, 15, 16];
  const [currentPos, setCurrentPos] = useState(0);
  const [mask, setMask] = useState('+7(___) ___-__-__');
  const [result, setResult] = useState<RegExpExecArray | null>([] as unknown as RegExpExecArray);

  const handleFocus = () => {
    setValue(mask);
  };
  const handleClear = () => {
    setValue(mask);
    setCurrentPos(0);
  };

  const onMaskValue = (val: string) => {

    const regExp = /\d/g;
    const res = regExp.exec(val[posArr[currentPos]]);
    setResult(res);

    if (val[posArr[currentPos]] !== value[posArr[currentPos]]) {
      if (res !== null) {
        refPhone.current?.setSelectionRange(posArr[currentPos + 1], posArr[currentPos + 1] + 1);
        setCurrentPos(currentPos + 1);
        setValue(val);
      }
    }
    if (
      !val.includes('_') &&
      val.length === 17 &&
      val[posArr[currentPos]] !== value[posArr[currentPos]]
    ) {
      if (res !== null) {
        setValue(val);
      }
    }
    return;
  };
  useEffect(() => {
    if (currentPos === 0) refPhone.current?.setSelectionRange(3, 4);
    if (result === null) {
      refPhone.current?.setSelectionRange(posArr[currentPos], posArr[currentPos] + 1);
      setResult([] as unknown as RegExpExecArray);
    }
  }, [result, currentPos]);

  useEffect(() => {
    if (!value.includes('_') && value.length === 17 && !mask.includes('_')) {
      setFormData(value);
      setMask(value);
    }
    if (initValue === 'complete') {
      setValue('');
    }
  }, [value, initValue, setValue, setFormData]);

  const pathname = usePathname();
  useEffect(() => {
    if (initValue !== undefined && pathname.includes('/edit')) {
      setValue(initValue);
      initValue = undefined;
    }

  }, [initValue, pathname, ]);

  return (
    <Input
      ref={refPhone}
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
      onFocus={handleFocus}
      onClear={handleClear}
      validate={(value) => {
        if (!value || value.includes('_')) return 'Телефон обязательно';
        return null;
      }}
    />
  );
};
export default TelephoneInput;
