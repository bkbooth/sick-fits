import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { CURRENT_USER_QUERY } from './User'

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`

class RemoveFromCart extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }

  render() {
    return <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{ id: this.props.id }}
    >
      {(removeFromCart, { loading }) => (
        <BigButton
          title="Delete Item"
          disabled={loading}
          onClick={() => {
            removeFromCart().catch(err => alert(err.message))
          }}
        >×</BigButton>
      )}
    </Mutation>

  }
}

export default RemoveFromCart
