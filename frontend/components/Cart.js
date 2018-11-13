import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'

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
              <Supreme>Your Cart</Supreme>
              <p>You have __ items in your cart.</p>
            </header>

            <footer>
              <p>$10.10</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
        )}
      </Query>
    )}
  </Mutation>
)

export default Cart
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION }
