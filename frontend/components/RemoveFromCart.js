import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from 'components/User';

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART($cartItemId: ID!) {
    removeFromCart(cartItemId: $cartItemId) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

const RemoveFromCart = ({ cartItemId }) => {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { cartItemId },
    update: handleMutationUpdate,
    optimisticResponse: {
      __typename: 'Mutation',
      removeFromCart: { __typename: 'CartItem', id: cartItemId },
    },
  });

  function handleRemoveFromCart() {
    removeFromCart().catch(error => alert(error.message));
  }

  function handleMutationUpdate(cache, payload) {
    const { id: cartItemId } = payload.data.removeFromCart;
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  }

  return (
    <BigButton onClick={handleRemoveFromCart} title="Remove item" disabled={loading}>
      ×
    </BigButton>
  );
};

RemoveFromCart.propTypes = {
  cartItemId: PropTypes.string.isRequired,
};

export default RemoveFromCart;
