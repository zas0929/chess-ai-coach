import { api } from '@/lib/api';

interface BillingUrlResponse {
  url: string;
}

export interface BillingStatus {
  plan: 'free' | 'pro';
  status: string;
  is_pro: boolean;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
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
