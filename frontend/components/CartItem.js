import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import formatMoney from 'lib/formatMoney';
import RemoveFromCart from 'components/RemoveFromCart';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightGrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem: { id: cartItemId, item, quantity } }) => {
  return (
    <CartItemStyles>
      {item ? (
        <>
          <img src={item.image} alt={item.title} width="100" />
          <div className="cart-item-details">
            <h3>{item.title}</h3>
            <p>
              {formatMoney(quantity * item.price)}
              {' - '}
              <em>
                {quantity} × {formatMoney(item.price)} each
              </em>
            </p>
          </div>
        </>
      ) : (
        <>
          <p>This item has been deleted.</p>
          {/* 👇 intentionally empty element to fill grid columns */}
          <i />
        </>
      )}
      <RemoveFromCart cartItemId={cartItemId} />
    </CartItemStyles>
  );
};

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string,
    }),
  }).isRequired,
};

export default CartItem;
