import React from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import CartStyles from 'components/styles/CartStyles';
import CloseButton from 'components/styles/CloseButton';
import SickButton from 'components/styles/SickButton';
import Supreme from 'components/styles/Supreme';

export const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE {
    cartOpen @client
  }
`;

export const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART {
    toggleCart @client
  }
`;

const Cart = () => (
  <Mutation mutation={TOGGLE_CART_MUTATION}>
    {toggleCart => (
      <Query query={LOCAL_STATE_QUERY}>
        {({ data }) => (
          <CartStyles open={data.cartOpen}>
            <header>
              <CloseButton onClick={toggleCart} title="close">
                ×
              </CloseButton>
              <Supreme>Your cart</Supreme>
              <p>You have 3 items in your cart.</p>
            </header>
            <footer>
              <p>$329</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
        )}
      </Query>
    )}
  </Mutation>
);

export default Cart;
