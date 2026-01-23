import { IOrderInit } from '@/types/order';
import { SetStateAction } from 'react';

export const NACHINKY_OPTIONS = [
  { value: 'SMETANNIK', label: 'СМЕТАННИК' },
  { value: 'YOGURT', label: 'ЙОГУРТОВЫЙ' },
  { value: 'BANAN_BARNY', label: 'БАНАНОВЫЙ БАРНИ' },
  { value: 'NEJNOST', label: 'НЕЖНОСТЬ' },
  { value: 'MORKOVNY', label: 'МОРКОВНЫЙ' },
  { value: 'BANAN', label: 'БАНАНОВЫЙ' },
  { value: 'NAPOLEON', label: 'НАПОЛЕОН' },
  { value: 'MOLOCHNAY_DEVOCHKA', label: 'МОЛОЧНАЯ ДЕВОЧКА' },
  { value: 'PRAGA', label: 'ПРАГА' },
  { value: 'SHOKOLAD_S_VISHNEY', label: 'ШОКОЛАД С ВИШНЕЙ' },
  { value: 'MAKOVY', label: 'МАКОВЫЙ' },
  { value: 'MALINOVY_LIMON', label: 'МАЛИНОВЫЙ ЛИМОН' },
  { value: 'TEMNY_LES', label: 'ТЕМНЫЙ ЛЕС' },
] as const;

export const TORTS_OPTIONS = [
  { value: 'RULET_SNICKERS', label: 'РУЛЕТ СНИКЕРС', price: 1700 },
  { value: 'RULET_MERENGOV', label: 'РУЛЕТ МЕРЕНГОВЫЙ', price: 1700 },
  { value: 'TORT_ZIFRA_BUKVA', label: 'ТОРТ ЦИФРА БУКВА', price: 1900 },
  { value: 'TORT_OT_2500_GR', label: 'ТОРТ ОТ 2500 ГР', price: 1700 },
  { value: 'TORT_DO_2500_GR', label: 'ТОРТ ДО 2500 ГР', price: 2000 },
  { value: 'TORT_S_SHOKOLAD_POKRYTIEM', label: 'ТОРТ С ШОКОЛАДНЫМ ПОКРЫТИЕМ', price: 1800 },
  { value: 'BENTO_TORT', label: 'БЕНТО ТОРТ', price: 1600 },
] as const;

export const UNIT_ABBREVIATIONS = [
  { value: 'GRAMS', label: 'г' },
  { value: 'KILOGRAMS', label: 'кг' },
  { value: 'LITERS', label: 'л' },
  { value: 'MILLILITERS', label: 'мл' },
  { value: 'PIECES', label: 'шт' },
] as const;

export const getNachinkyLabel = (value: string) => {
  const option = NACHINKY_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : value;
};

export const getTortsLabel = (value: string) => {
  const option = TORTS_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : value;
};

export const getTortPrice = (value: string) => {
  const option = TORTS_OPTIONS.find((opt) => opt.value === value);
  return option ? option.price : value;
};

export const calcPriceForTort = (
  value: string,
  setFormData: (value: SetStateAction<IOrderInit>) => void,
  formData: IOrderInit,
): number => {
  let tort: string = '';
  let price: number = 0;
  for (let obj of TORTS_OPTIONS) {
    if (obj.value === value) {
      tort = obj.value;
      price = obj.price;
    }
  }
  if (price) {
    setFormData({ ...formData, tort: tort });
  } else {
    setFormData({ ...formData, tort: '' });
  }
  return price;
};
