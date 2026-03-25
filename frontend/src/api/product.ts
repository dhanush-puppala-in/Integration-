import { axiosPrivate } from './axios';

export const productApi = {
  getAllProducts: async () => {
    return await axiosPrivate.get(`/product/getAllProducts`);
  }
};
