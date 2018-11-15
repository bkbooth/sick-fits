import PleaseSignin from '../components/PleaseSignin'
import OrderList from '../components/OrderList'

const Orders = props => (
  <div>
    <PleaseSignin>
      <OrderList />
    </PleaseSignin>
  </div>
)

export default Orders
