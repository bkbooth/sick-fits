import React from 'react';
import { Query } from 'react-apollo';
import { distanceInWordsToNow } from 'date-fns';
import gql from 'graphql-tag';
import Link from 'next/link';
import styled from 'styled-components';
import formatMoney from 'lib/formatMoney';
import Error from 'components/ErrorMessage';
import OrderItemStyles from 'components/styles/OrderItemStyles';

export const USER_ORDERS_QUERY = gql`
  query USER_ORDERS {
    userOrders {
      id
      total
      createdAt
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

const StyledUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const OrderList = () => (
  <Query query={USER_ORDERS_QUERY}>
    {({ data, error, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <Error error={error} />;
      const { userOrders: orders } = data;
      return (
        <>
          <h2>You have {orders.length} orders</h2>
          <StyledUl>
            {orders.map(order => (
              <OrderItemStyles key={order.id}>
                <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
                  <a>
                    <div className="order-meta">
                      <p>
                        {order.items.reduce((total, orderItem) => total + orderItem.quantity, 0)}{' '}
                        items
                      </p>
                      <p>{order.items.length} products</p>
                      <p>{distanceInWordsToNow(order.createdAt, { addSuffix: true })}</p>
                      <p>{formatMoney(order.total)}</p>
                    </div>
                    <div className="images">
                      {order.items.map(orderItem => (
                        <img src={orderItem.image} alt={orderItem.title} key={orderItem.id} />
                      ))}
                    </div>
                  </a>
                </Link>
              </OrderItemStyles>
            ))}
          </StyledUl>
        </>
      );
    }}
  </Query>
);

export default OrderList;
