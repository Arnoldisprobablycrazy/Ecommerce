// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import OrderSuccessClient from './OrderSuccessClient';

export default function OrderSuccessPage() {
  return <OrderSuccessClient />;
}