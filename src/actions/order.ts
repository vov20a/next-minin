'use server';

import { limitOrders } from '@/config/pagesContent';
import { Order, TORT } from '@/generated/prisma';
import { orderSchema } from '@/schema/zod';
import prisma from '@/utils/prisma';
import { ZodError } from 'zod';

export async function createOrder(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      nachinka: formData.get('nachinka') as string,
      tort: formData.get('tort') as string,
      weight: parseFloat(formData.get('weight') as string),
      pricePerUnit: formData.get('pricePerUnit')
        ? parseFloat(formData.get('pricePerUnit') as string)
        : null,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      orderDate: formData.get('orderDate') as string,
      priceId: formData.get('priceId') as string,
      status: JSON.parse(formData.get('status') as string),
    };
    const validateData = orderSchema.parse(data);

    const order = await prisma.order.create({
      data: {
        name: validateData.name,
        nachinka: validateData.nachinka,
        tort: validateData.tort,
        weight: validateData.weight,
        pricePerUnit: validateData.pricePerUnit,
        description: validateData.description,
        address: validateData.address,
        phone: validateData.phone,
        orderDate: validateData.orderDate,
        priceId: validateData.priceId,
        status: validateData.status,
      },
    });
    return { success: true, order };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors.map((e) => e.message).join(', ') };
    }
    console.log('Order error', error);
    return { error: 'Add Order error' };
  }
}

export async function editOrder(formData: FormData, id: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id },
    });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    const data = {
      name: formData.get('name') as string,
      nachinka: formData.get('nachinka') as string,
      tort: formData.get('tort') as string,
      weight: parseFloat(formData.get('weight') as string),
      pricePerUnit: formData.get('pricePerUnit')
        ? parseFloat(formData.get('pricePerUnit') as string)
        : null,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      orderDate: formData.get('orderDate') as string,
      priceId: formData.get('priceId') as string,
      status: JSON.parse(formData.get('status') as string),
    };
    const validateData = orderSchema.parse(data);

    const editOrder = await prisma.order.update({
      where: {
        id: order.id,
      },

      data: {
        name: validateData.name,
        nachinka: validateData.nachinka,
        tort: validateData.tort,
        weight: validateData.weight,
        pricePerUnit: validateData.pricePerUnit,
        description: validateData.description,
        address: validateData.address,
        phone: validateData.phone,
        orderDate: validateData.orderDate,
        priceId: validateData.priceId,
        status: validateData.status,
      },
    });
    const totalPrice = await getTotalPrice();

    return { success: true, order: editOrder, totalPrice };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors.map((e) => e.message).join(', ') };
    }
    console.log('EditOrder error', error);
    return { error: 'Edit Order error' };
  }
}

export async function getOrdersCount() {
  try {
    const ordersCount = await prisma.order.count();
    return { success: true, ordersCount };
  } catch (error) {
    console.log('GetOrdersCount error', error);
    return { error: 'GetOrdersCount error' };
  }
}
export async function getChangeStatus(id: string, status: boolean) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: !status,
      },
    });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    return { success: true };
  } catch (error) {
    console.log('GetChangeStatus error', error);
    return { error: 'GetChangeStatus error' };
  }
}

export async function getOrders(page: number) {
  try {
    const limit = limitOrders;

    const orders = await prisma.order.findMany({
      skip: limit * (page - 1),
      take: limit,
    });
    return { success: true, orders };
  } catch (error) {
    console.log('GetOrders error', error);
    return { error: 'GetOrders error' };
  }
}

export async function getOrder(id: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id },
      include: {
        price: true,
      },
    });
    return { success: true, order };
  } catch (error) {
    console.log('GetOrder error', error);
    return { error: 'GetOrder error' };
  }
}

export async function deleteOrder(id: string) {
  try {
    const order = await prisma.order.delete({
      where: { id },
    });
    const price = await prisma.price.delete({
      where: { id: order.priceId ?? '' },
    });
    const orderCount = await prisma.order.count();
    return { success: true, order, price, orderCount };
  } catch (error) {
    console.log('DeleteOrder error', error);
    return { error: 'DeleteOrder error' };
  }
}

export async function searchByName(name: string | undefined = undefined, page: number) {
  try {
    const limit = limitOrders;
    const orders = await prisma.order.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive', // Регистронезависимый поиск
        },
      },
      include: {
        price: true,
      },
    });
    const orderCount = orders.length;
    const startNumber = limit * (page - 1);
    const endNumber = orderCount > startNumber + limit ? startNumber + limit : orderCount;
    const searchOrders = orders.slice(startNumber, endNumber);

    return { success: true, orders: searchOrders, orderCount };
  } catch (error) {
    console.log('SearchOrder error', error);
    return { error: 'SearchOrder error' };
  }
}

export async function searchByTort(tort: TORT, page: number) {
  try {
    const limit = limitOrders;

    const [searchOrders, filteredPrice, resultCount]: [
      Order[],
      [{ sum: number }],
      [{ count: number }],
    ] = await prisma.$transaction([
      prisma.$queryRaw`SELECT * FROM orders  WHERE tort = CAST(${tort} AS "TORT") LIMIT ${limit} OFFSET ${
        limit * (page - 1)
      }`,
      prisma.$queryRaw`SELECT SUM("pricePerUnit") FROM orders  GROUP BY tort HAVING tort = CAST(${tort} AS "TORT")`,
      prisma.$queryRaw`SELECT COUNT(*) FROM orders  WHERE tort = CAST(${tort} AS "TORT")`,
    ]);

    const orderCount = Number(resultCount[0].count.toString().replace('n', ''));

    return {
      success: true,
      orders: searchOrders,
      orderCount: orderCount,
      filteredPrice: filteredPrice[0].sum,
    };
  } catch (error) {
    console.log('SearchOrder error', error);
    return { error: 'SearchOrder error' };
  }
}
export async function searchByStatus(status: boolean, page: number) {
  try {
    const limit = limitOrders;
    const [searchOrders, filteredPrice, resultCount]: [
      Order[],
      [{ sum: number }],
      [{ count: number }],
    ] = await prisma.$transaction([
      prisma.$queryRaw`SELECT * FROM orders  WHERE status = ${status} LIMIT ${limit} OFFSET ${
        limit * (page - 1)
      }`,
      prisma.$queryRaw`SELECT SUM("pricePerUnit") FROM orders  GROUP BY status HAVING status = ${status}`,
      prisma.$queryRaw`SELECT COUNT(*) FROM orders  WHERE status = ${status}`,
    ]);

    const orderCount = Number(resultCount[0].count.toString().replace('n', ''));

    return {
      success: true,
      orders: searchOrders,
      orderCount: orderCount,
      filteredPrice: filteredPrice[0].sum,
    };
  } catch (error) {
    console.log('SearchByStatus error', error);
    return { error: 'SearchByStatus error' };
  }
}
export async function getTotalPrice() {
  try {
    const totalPrice = await prisma.order.aggregate({
      _sum: {
        pricePerUnit: true,
      },
    });

    return { success: true, totalPrice: totalPrice._sum };
  } catch (error) {
    console.log('SearchOrder error', error);
    return { error: 'SearchOrder error' };
  }
}
export async function getByOrderDate(orderDate: string, page: number) {
  try {
    const limit = limitOrders;

    const [aggrs, orders] = await prisma.$transaction([
      prisma.order.aggregate({
        where: {
          orderDate: {
            contains: orderDate,
            mode: 'insensitive',
          },
        },
        _sum: {
          pricePerUnit: true,
        },
        _count: {
          pricePerUnit: true,
        },
      }),
      prisma.order.findMany({
        where: {
          orderDate: {
            contains: orderDate,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: limit,
        skip: limit * (page - 1),
      }),
    ]);
    // console.log(aggrs, orders);

    const orderCount = aggrs._count.pricePerUnit;

    const orderSumm = aggrs._sum.pricePerUnit;

    return { success: true, orders, orderSumm, orderCount };
  } catch (error) {
    console.log('OrderDate error', error);
    return { error: 'OrderDate error' };
  }
}
