import { api } from '@/lib/api';

interface BillingUrlResponse {
  url: string;
}

export const BillingService = {
  async createCheckoutSession() {
    return (
      await api.post<BillingUrlResponse>('/billing/checkout')
    ).data;
  },

  async createPortalSession() {
    return (
      await api.post<BillingUrlResponse>('/billing/portal')
    ).data;
  },
};
