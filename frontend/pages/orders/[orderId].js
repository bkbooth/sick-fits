import { useRouter } from 'next/router';
import Order from 'components/Order';
import PleaseSignin from 'components/PleaseSignin';

const OrderPage = () => {
  const router = useRouter();
  if (!router) return null;

  return (
    <PleaseSignin>
      <Order orderId={router.query.orderId} />
    </PleaseSignin>
  );
};

export default OrderPage;
