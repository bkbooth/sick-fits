import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

export const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART($itemId: ID!) {
    addToCart(itemId: $itemId) {
      id
      quantity
    }
  }
`;

const AddToCart = ({ itemId }) => (
  <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ itemId }}>
    {(addToCart, { loading }) => (
      <button onClick={addToCart} disabled={loading}>
        🛒 Add{loading ? 'ing' : ''} to cart
      </button>
    )}
  </Mutation>
);

AddToCart.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default AddToCart;
