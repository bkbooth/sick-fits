import React from 'react';
import { Mutation } from 'react-apollo';
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
  function createRemoveHandler(mutation) {
    return () => {
      mutation().catch(error => alert(error.message));
    };
  }

  return (
    <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{ cartItemId }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(removeFromCart, { loading }) => (
        <BigButton
          onClick={createRemoveHandler(removeFromCart)}
          title="Remove item"
          disabled={loading}
        >
          ×
        </BigButton>
      )}
    </Mutation>
  );
};

RemoveFromCart.propTypes = {
  cartItemId: PropTypes.string.isRequired,
};

export default RemoveFromCart;
