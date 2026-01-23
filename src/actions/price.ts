'use server';

import { priceSchema } from '@/schema/zod';
import prisma from '@/utils/prisma';
import { ZodError } from 'zod';

export async function createPrice(formData: FormData) {
  try {
    const data = {
      totalAmount: parseFloat(formData.get('totalAmount') as string),
      priceForKg: parseFloat(formData.get('priceForKg') as string),
      package: parseFloat(formData.get('package') as string),
      cover: formData.get('cover') ? parseFloat(formData.get('cover') as string) : null,
      fruit: formData.get('fruit') ? parseFloat(formData.get('fruit') as string) : null,
      figure: formData.get('figure') ? parseFloat(formData.get('figure') as string) : null,
      delivery: formData.get('delivery') ? parseFloat(formData.get('delivery') as string) : null,
      others: formData.get('others') ? parseFloat(formData.get('others') as string) : null,
    };

    const validateData = priceSchema.parse(data);

    const price = await prisma.price.create({
      data: {
        totalAmount: validateData.totalAmount,
        priceForKg: validateData.priceForKg,
        package: validateData.package,
        cover: validateData.cover,
        fruit: validateData.fruit,
        figure: validateData.figure,
        delivery: validateData.delivery,
        others: validateData.others,
      },
    });

    return { success: true, price };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors.map((e) => e.message).join(', ') };
    }
    console.log('Price error', error);
    return { error: 'Add Price error' };
  }
}

export async function getPrice(id: string) {
  try {
    const price = await prisma.price.findFirst({
      where: { id },
    });
    return { success: true, price };
  } catch (error) {
    console.log('GetPrice error', error);
    return { error: 'GetPrice error' };
  }
}

export async function editPrice(formData: FormData, id: string) {
  try {
    const price = await prisma.price.findFirst({
      where: { id },
    });
    if (!price) {
      return { success: false, error: 'Price not found' };
    }
    const data = {
      totalAmount: parseFloat(formData.get('totalAmount') as string),
      priceForKg: parseFloat(formData.get('priceForKg') as string),
      package: parseFloat(formData.get('package') as string),
      cover: formData.get('cover') ? parseFloat(formData.get('cover') as string) : null,
      fruit: formData.get('fruit') ? parseFloat(formData.get('fruit') as string) : null,
      figure: formData.get('figure') ? parseFloat(formData.get('figure') as string) : null,
      delivery: formData.get('delivery') ? parseFloat(formData.get('delivery') as string) : null,
      others: formData.get('others') ? parseFloat(formData.get('others') as string) : null,
    };
    const validateData = priceSchema.parse(data);

    const editPrice = await prisma.price.update({
      where: {
        id: price.id,
      },

      data: {
        totalAmount: validateData.totalAmount,
        priceForKg: validateData.priceForKg,
        package: validateData.package,
        cover: validateData.cover,
        fruit: validateData.fruit,
        figure: validateData.figure,
        delivery: validateData.delivery,
        others: validateData.others,
      },
    });
    return { success: true, price: editPrice };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors.map((e) => e.message).join(', ') };
    }
    console.log('EditPrice error', error);
    return { error: 'Edit Price error' };
  }
}

export async function deletePrice(id: string) {
  try {
    const price = await prisma.price.delete({
      where: { id },
    });
    return { success: true, price };
  } catch (error) {
    console.log('DeletePrice error', error);
    return { error: 'DeletePrice error' };
  }
}
