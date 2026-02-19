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
  const [mask, setMask] = useState('+7(');
  const [, setResult] = useState<RegExpExecArray | null>([] as unknown as RegExpExecArray);

  const handleFocus = () => {
    setValue(mask);
    setCurrentPos(0);
  };
  const handleClear = () => {
    setValue(mask);
    setCurrentPos(0);
  };

  const onMaskValue = (val: string) => {
    const regExp = /\d/g;
    const res = regExp.exec(val[posArr[currentPos]]);
    setResult(res);

    if (val[posArr[currentPos]] !== value[posArr[currentPos]] && val.length <= 17) {
      if (res !== null) {
        // refPhone.current?.setSelectionRange(posArr[currentPos + 1], posArr[currentPos + 1] + 1);
        setCurrentPos(currentPos + 1);
        if (currentPos === 2) {
          setValue(val + ') ');
        } else if (currentPos === 5) {
          setValue(val + '-');
        } else if (currentPos === 7) {
          setValue(val + '-');
        } else {
          setValue(val);
        }
        if (val.length === 17) setMask(val);
      }
    }

    return;
  };

  useEffect(() => {
    if (mask.length === 17) {
      setFormData(mask);
      setMask('+7(');
    }
    if (initValue === 'complete') {
      setMask('+7(');
    }
  }, [mask, initValue, setMask, setFormData]);

  const pathname = usePathname();
  useEffect(() => {
    if (initValue !== undefined && pathname.includes('/edit')) {
      setValue(initValue);
      initValue = undefined;
    }
  }, [initValue, pathname]);

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
