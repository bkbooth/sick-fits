import React from 'react';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import gql from 'graphql-tag';
import Head from 'next/head';
import PropTypes from 'prop-types';
import formatMoney from 'lib/formatMoney';
import Error from 'components/ErrorMessage';
import OrderStyles from 'components/styles/OrderStyles';

export const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER($orderId: ID!) {
    order(id: $orderId) {
      id
      total
      charge
      createdAt
      user {
        id
      }
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

const Order = ({ orderId }) => (
  <Query query={SINGLE_ORDER_QUERY} variables={{ orderId }}>
    {({ data, error, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <Error error={error} />;
      const { order } = data;
      return (
        <OrderStyles>
          <Head>
            <title>Order {order.id} | Sick Fits!</title>
          </Head>
          <p>
            <span>Order ID</span>
            <span>{order.id}</span>
          </p>
          <p>
            <span>Charge</span>
            <span>{order.charge}</span>
          </p>
          <p>
            <span>Date</span>
            <span>{format(order.createdAt, 'Do MMMM, YYYY h:mm A')}</span>
          </p>
          <p>
            <span>Total</span>
            <span>
              {formatMoney(order.total)} for {order.items.length} item
              {order.items.length === 1 ? '' : 's'}
            </span>
          </p>
          <div className="items">
            {order.items.map(orderItem => (
              <div className="order-item" key={orderItem.id}>
                <img src={orderItem.image} alt={orderItem.title} />
                <div className="item-details">
                  <h2>{orderItem.title}</h2>
                  <p>
                    Quantity: {orderItem.quantity}
                    <br />
                    Price: {formatMoney(orderItem.price)}
                    <br />
                    Subtotal: {formatMoney(orderItem.quantity * orderItem.price)}
                  </p>
                  <p>{orderItem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </OrderStyles>
      );
    }}
  </Query>
);

Order.propTypes = {
  orderId: PropTypes.string.isRequired,
};

export default Order;
