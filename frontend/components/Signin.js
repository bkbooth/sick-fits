import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Router from 'next/router';
import Error from 'components/ErrorMessage';
import { CURRENT_USER_QUERY } from 'components/User';
import Form from 'components/styles/Form';

export const SIGNIN_MUTATION = gql`
  mutation SIGNIN($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signin = ({ redirect = true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signin, { error, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: { email, password },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  function createChangeHandler(setter) {
    return event => setter(event.currentTarget.value);
  }

  async function handleSignin(event) {
    event.preventDefault();
    await signin();
    setEmail('');
    setPassword('');
    redirect && Router.push('/');
  }

  return (
    <Form onSubmit={handleSignin} method="post">
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign in to your account</h2>

        <Error error={error} />

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

        <button type="submit">Sign{loading ? 'ing ' : ''} in</button>
      </fieldset>
    </Form>
  );
};

export default Signin;
