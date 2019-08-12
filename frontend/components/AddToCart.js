import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from 'components/User';

export const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART($itemId: ID!) {
    addToCart(itemId: $itemId) {
      id
      quantity
    }
  }
`;

const AddToCart = ({ itemId }) => {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { itemId },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  return (
    <button onClick={addToCart} disabled={loading}>
      🛒 Add{loading ? 'ing' : ''} to cart
    </button>
  );
};

AddToCart.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default AddToCart;
