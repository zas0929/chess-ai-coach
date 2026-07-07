import { toast } from 'react-hot-toast';

export const ToastService = {
  success(message: string) {
    toast.success(message);
  },

  error(message: string) {
    toast.error(message);
  },

  info(message: string) {
    toast(message);
  },
};
