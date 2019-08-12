import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { TOGGLE_CART_MUTATION } from 'components/Cart';

const ToggleCart = ({ children }) => {
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);
  return <button onClick={toggleCart}>{children}</button>;
};

export default ToggleCart;
