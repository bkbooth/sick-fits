import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`

class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
      {(signup, { error, loading }) => (
        <Form method="post" onSubmit={async e => {
          e.preventDefault()
          await signup()
          this.setState({ email: '', name: '', password: '' })
        }}>
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Sign Up for an Account</h2>
            <Error error={error} />

            <label htmlFor="email">
              Email
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.saveToState}
              />
            </label>

            <label htmlFor="name">
              Name
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={this.state.name}
                onChange={this.saveToState}
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.saveToState}
              />
            </label>

            <button type="submit">Sign Up!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  }
}

export default Signup
export { SIGNUP_MUTATION }
