import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import StripeCheckout from 'react-stripe-checkout'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import NProgress from 'nprogress'
import Error from './ErrorMessage'
import User, { CURRENT_USER_QUERY } from './User'
import calcTotalPrice from '../lib/calcTotalPrice'

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)
}

class TakeMyMoney extends React.Component {
  onToken(res) {
    console.log('Stripe token:', res.id)
  }

  render() {
    return <User>
      {({ data: { me } }) => (
        <StripeCheckout
          amount={calcTotalPrice(me.cart)}
          name="Sick Fits!"
          description={`Order of ${totalItems(me.cart)} items.`}
          image={me.cart[0].item && me.cart[0].item.image}
          stripeKey="pk_test_nmnQGOikwUBoSjWEFR2tvQdR"
          currency="AUD"
          email={me.email}
          token={res => this.onToken(res)}
        >
          {this.props.children}
        </StripeCheckout>
      )}
    </User>
  }
}

export default TakeMyMoney
