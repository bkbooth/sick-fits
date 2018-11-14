import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'
import User from './User'
import CartItem from './CartItem'
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

const Cart = () => (
  <User>
    {({ data: { me } }) => {
      if (!me) return null
      return (
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {(toggleCart) => (
            <Query query={LOCAL_STATE_QUERY}>
              {({ data }) => (
                <CartStyles open={data.cartOpen}>
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
                    <SickButton>Checkout</SickButton>
                  </footer>
                </CartStyles>
              )}
            </Query>
          )}
        </Mutation>
      )
    }}
  </User>
)

export default Cart
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION }
