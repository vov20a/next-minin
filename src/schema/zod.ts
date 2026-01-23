import { boolean, number, object, string } from 'zod';
import { z } from 'zod';

export const signInSchema = object({
  email: string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export const orderSchema = object({
  name: z.string().min(1, 'Название обязательно'),
  nachinka: z.enum([
    'SMETANNIK',
    'YOGURT',
    'BANAN_BARNY',
    'NEJNOST',
    'MORKOVNY',
    'BANAN',
    'NAPOLEON',
    'MOLOCHNAY_DEVOCHKA',
    'PRAGA',
    'SHOKOLAD_S_VISHNEY',
    'MAKOVY',
    'MALINOVY_LIMON',
    'TEMNY_LES',
  ]),
  tort: z.enum([
    'RULET_SNICKERS',
    'RULET_MERENGOV',
    'TORT_ZIFRA_BUKVA',
    'TORT_OT_2500_GR',
    'TORT_DO_2500_GR',
    'TORT_S_SHOKOLAD_POKRYTIEM',
    'BENTO_TORT',
  ]),
  weight: number({ invalid_type_error: 'Цена должна быть числом' }).min(
    0,
    'Вес должен быть положительным',
  ),
  pricePerUnit: number({ invalid_type_error: 'Цена должна быть числом' })
    .min(0, 'Цена должна быть положительной')
    .nullable(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().min(11, 'Номер обязательно'),
  orderDate: z.string().min(11, 'Date обязательно'),
  priceId: z.string().min(11, 'PriceId обязательно'),
  status: boolean({ invalid_type_error: 'Статус должен быть true|false' }),
});

export const priceSchema = object({
  totalAmount: number({ invalid_type_error: 'Сумма должна быть числом' }).min(
    0,
    'Сумма должна быть положительной',
  ),
  priceForKg: number({ invalid_type_error: 'Цена должна быть числом' }).min(
    0,
    'Цена должна быть положительной',
  ),
  package: number({ invalid_type_error: 'Цена упаковки должна быть числом' }).min(
    0,
    'Цена упаковки должена быть положительной',
  ),
  cover: number({ invalid_type_error: 'Цена покрытия должна быть числом' })
    .min(0, 'Цена покрытия должна быть положительной')
    .nullable(),
  fruit: number({ invalid_type_error: 'Цена должна быть числом' })
    .min(0, 'Цена должна быть положительной')
    .nullable(),
  figure: number({ invalid_type_error: 'Цена фигурок должна быть числом' })
    .min(0, 'Цена фигурок должна быть положительной')
    .nullable(),
  delivery: number({ invalid_type_error: 'Цена доставки должна быть числом' })
    .min(0, 'Цена доставки должна быть положительной')
    .nullable(),
  others: number({ invalid_type_error: 'Цена другого должна быть числом' })
    .min(0, 'Цена другого должна быть положительной')
    .nullable(),
});
