import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Error from 'components/ErrorMessage';
import { CURRENT_USER_QUERY } from 'components/User';
import Form from 'components/styles/Form';

export const SIGNUP_MUTATION = gql`
  mutation SIGNUP($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function createChangeHandler(setter) {
    return event => setter(event.currentTarget.value);
  }

  function createSubmissionHandler(mutation) {
    return async event => {
      event.preventDefault();
      await mutation();
      Router.push('/');
    };
  }

  return (
    <Mutation
      mutation={SIGNUP_MUTATION}
      variables={{ name, email, password }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => (
        <Form onSubmit={createSubmissionHandler(signup)} method="post">
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Signup for an account</h2>

            <Error error={error} />

            <label htmlFor="name">
              Name
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={createChangeHandler(setName)}
                required
              />
            </label>

            <label htmlFor="email">
              Email
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={createChangeHandler(setEmail)}
                required
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={createChangeHandler(setPassword)}
                required
              />
            </label>

            <button type="submit">Sign{loading ? 'ing ' : ''}up</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default Signup;
