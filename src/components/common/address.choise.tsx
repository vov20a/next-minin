'use client';

import { useEffect, useRef } from 'react';
import { AddressSuggestions, DaDataAddress, DaDataSuggestion } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface IProps {
  // onChange?: (value?: string) => void;

  setFormData: (value: string) => void;
}

export const AddressChoise: React.FC<IProps> = ({ setFormData }) => {
  const token = '8f4afcb5a9cdcdba2615b70343acacf11ecdc7f0';

  const suggestionsRef = useRef<AddressSuggestions>(null);

  const handleChange = (data: DaDataSuggestion<DaDataAddress> | undefined) => {
    if (data?.value !== undefined) {
      // onChange?.(data.value);
      setFormData(data.value);
    }
  };
  useEffect(() => {
    if (suggestionsRef.current) {
      // suggestionsRef.current.setInputValue('');
      suggestionsRef.current.focus();
    }
  }, [suggestionsRef]);

  return (
    <>
      <AddressSuggestions
        ref={suggestionsRef}
        containerClassName="w-full relative text-default-500"
        token={token}
        onChange={(data) => handleChange?.(data)}
        defaultQuery="Санкт-Петербург"
        inputProps={{
          placeholder: 'Начните вводить адрес...',
          name: 'address',
          id: 'react input',
        }}
      />
    </>
  );
};
