import OrderList from 'components/OrderList';
import PleaseSignin from 'components/PleaseSignin';

const OrdersPage = () => (
  <PleaseSignin>
    <OrderList />
  </PleaseSignin>
);

export default OrdersPage;
