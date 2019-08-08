import React from 'react';
import { Mutation } from 'react-apollo';
import StripeCheckout from 'react-stripe-checkout';
import gql from 'graphql-tag';
import calculateTotalPrice from 'lib/calculateTotalPrice';
import countCartItems from 'lib/countCartItems';
import User, { CURRENT_USER_QUERY } from 'components/User';

export const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const TakeMyMoney = ({ children }) => {
  function createOnToken(mutation) {
    return async ({ id }) => {
      try {
        await mutation({ variables: { token: id } });
      } catch (error) {
        alert(error.message);
      }
    };
  }

  return (
    <User>
      {({ data: { me } }) => (
        <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
          {createOrder => (
            <StripeCheckout
              name="Sick Fits!"
              description={`Order of ${countCartItems(me.cart)} items`}
              image={me.cart[0].item ? me.cart[0].item.image : null}
              amount={calculateTotalPrice(me.cart)}
              currency="AUD"
              stripeKey="pk_test_nmnQGOikwUBoSjWEFR2tvQdR"
              email={me.email}
              token={createOnToken(createOrder)}
            >
              {children}
            </StripeCheckout>
          )}
        </Mutation>
      )}
    </User>
  );
};

export default TakeMyMoney;
