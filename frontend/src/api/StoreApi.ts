import { axiosPrivate } from './axios';

export const StoreApi = {
  getProducts: async () => {
    return await axiosPrivate.get('/product/getAllProducts');
  }
};
