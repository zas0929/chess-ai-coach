export interface BillingStatus {
  plan: 'free' | 'pro' | string;
  status: string;
  is_pro: boolean;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
}
