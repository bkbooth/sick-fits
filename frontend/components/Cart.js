import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { adopt } from 'react-adopt'
import gql from 'graphql-tag'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'
import User from './User'
import CartItem from './CartItem'
import TakeMyMoney from './TakeMyMoney'
import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney'
import apostrophiseName from '../lib/apostrophiseName'

const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE_QUERY {
    cartOpen @client
  }
`

const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
})

const Cart = () => (
  <Composed>
    {({ user, toggleCart, localState }) => {
      const me = user.data.me
      if (!me) return null
      return (
        <CartStyles open={localState.data.cartOpen}>
          <header>
            <CloseButton
              title="close"
              onClick={toggleCart}
            >×</CloseButton>
            <Supreme>{apostrophiseName(me.name)} Cart</Supreme>
            <p>You have {me.cart.length} item{me.cart.length === 1 ? '': 's'} in your cart.</p>
          </header>

          <ul>
            {me.cart.map(cartItem => <CartItem cartItem={cartItem} key={cartItem.id} />)}
          </ul>

          <footer>
            <p>{formatMoney(calcTotalPrice(me.cart))}</p>
            <TakeMyMoney>
              <SickButton disabled={!me.cart.length}>Checkout</SickButton>
            </TakeMyMoney>
          </footer>
        </CartStyles>
      )
    }}
  </Composed>
)

export default Cart
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION }
