import { api } from '@/lib/api';
import { BillingStatus } from '@/types/billing';

interface BillingUrlResponse {
  url: string;
}

export const BillingService = {
  async getStatus() {
    return (
      await api.get<BillingStatus>('/billing/status')
    ).data;
  },

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
