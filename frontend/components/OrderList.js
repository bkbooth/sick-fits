import React from 'react'
import Link from 'next/link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { formatDistance } from 'date-fns';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage'
import OrderItemStyles from './styles/OrderItemStyles'

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        quantity
        image
      }
    }
  }
`

const OrdersUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`

class OrderList extends React.Component {
  render() {
    return <Query query={USER_ORDERS_QUERY}>
      {({ data: { orders }, loading, error }) => {
        if (error) return <Error error={error} />
        if (loading) return <p>Loading...</p>
        return (
          <div>
            <h2>You have {orders.length} orders</h2>
            <OrdersUl>
              {orders.map(order => (
                <OrderItemStyles key={order.id}>
                  <Link href={{
                    pathname: '/order',
                    query: { id: order.id },
                  }}>
                    <a>
                      <div className="order-meta">
                        <p>{order.items.reduce((t, item) => t + item.quantity, 0)} items</p>
                        <p>{order.items.length} products</p>
                        <p>{formatDistance(order.createdAt, new Date())} ago</p>
                        <p>{formatMoney(order.total)}</p>
                      </div>
                      <div className="images">
                        {order.items.map(item => (
                          <img src={item.image} alt={item.title} key={item.id} />
                        ))}
                      </div>
                    </a>
                  </Link>
                </OrderItemStyles>
              ))}
            </OrdersUl>
          </div>
        )
      }}
    </Query>
  }
}

export default OrderList
export { USER_ORDERS_QUERY }
