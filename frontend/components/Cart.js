import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
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

const Cart = () => {
  const { data: localState } = useQuery(LOCAL_STATE_QUERY);
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);

  return (
    <User>
      {({ data: user }) => {
        if (!user.me) return null;
        const { me } = user;
        return (
          <CartStyles open={localState.cartOpen}>
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
    </User>
  );
};

export default Cart;
