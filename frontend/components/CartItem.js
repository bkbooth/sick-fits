import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import RemoveFromCart from './RemoveFromCart'
import formatMoney from '../lib/formatMoney'

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
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
`

const CartItem = ({ cartItem }) => {
  if (!cartItem.item) return (
    <CartItemStyles>
      <p>This item has been removed.</p>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  )
  return <CartItemStyles>
    <img src={cartItem.item.image} width="100" alt={cartItem.item.title} />
    <div className="cart-item-details">
      <h3>{cartItem.item.title}</h3>
      <p>
        {formatMoney(cartItem.item.price * cartItem.quantity)}
        {' - '}
        <em>{cartItem.quantity} × {formatMoney(cartItem.item.price)} each</em>
      </p>
    </div>
    <RemoveFromCart id={cartItem.id} />
  </CartItemStyles>
}

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    id: PropTypes.string,
    quantity: PropTypes.number,
    item: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      price: PropTypes.number,
    })
  }).isRequired,
}

export default CartItem
