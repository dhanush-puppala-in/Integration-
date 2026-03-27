import { axiosPrivate } from './axios';

export const StoreApi = {
  getProducts: async () => {
    return await axiosPrivate.get('/product/getAllProducts');
  },
  createOrder: async (data: { productId: string; quantity: number; addressId?: string; variantId?: string }) => {
    return await axiosPrivate.post('/order/createOrder', data);
  },
  getOrders: async () => {
    return await axiosPrivate.get('/order/getOrders');
  },
};
