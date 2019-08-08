import React from 'react';
import { adopt } from 'react-adopt';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import apostrophiseName from 'lib/apostrophiseName';
import calculateTotalPrice from 'lib/calculateTotalPrice';
import formatMoney from 'lib/formatMoney';
import CartItem from 'components/CartItem';
import TakeMyMoney from 'components/TakeMyMoney';
import User from 'components/User';
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

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = () => (
  <Composed>
    {({ localState, toggleCart, user }) => {
      if (!user.data.me) return null;
      const { me } = user.data;
      return (
        <CartStyles open={localState.data.cartOpen}>
          <header>
            <CloseButton onClick={toggleCart} title="close">
              ×
            </CloseButton>
            <Supreme>{apostrophiseName(me.name)} cart</Supreme>
            <p>
              You have {me.cart.length} item{me.cart.length === 1 ? '' : 's'} in your cart.
            </p>
          </header>

          <ul>
            {me.cart.map(cartItem => (
              <CartItem cartItem={cartItem} key={cartItem.id} />
            ))}
          </ul>

          <footer>
            <p>{formatMoney(calculateTotalPrice(me.cart))}</p>
            {me.cart.length > 0 && (
              <TakeMyMoney>
                <SickButton>Checkout</SickButton>
              </TakeMyMoney>
            )}
          </footer>
        </CartStyles>
      );
    }}
  </Composed>
);

export default Cart;
