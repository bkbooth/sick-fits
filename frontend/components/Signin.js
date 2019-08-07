import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
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

const Signin = () => {
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
      mutation={SIGNIN_MUTATION}
      variables={{ email, password }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signin, { error, loading }) => (
        <Form onSubmit={createSubmissionHandler(signin)} method="post">
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Signin to your account</h2>

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

            <button type="submit">Sign{loading ? 'ing ' : ''}in</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default Signin;
