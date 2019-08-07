import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Error from 'components/ErrorMessage';
import { CURRENT_USER_QUERY } from 'components/User';
import Form from 'components/styles/Form';

export const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD($resetToken: String!, $password: String!) {
    resetPassword(resetToken: $resetToken, password: $password) {
      id
      email
      name
    }
  }
`;

const Reset = ({ resetToken }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function createChangeHandler(setter) {
    return event => setter(event.currentTarget.value);
  }

  function createSubmissionHandler(mutation) {
    return async event => {
      event.preventDefault();
      if (password !== confirmPassword) {
        setErrorMessage('Password and confirm password must be the same');
        return;
      }
      setErrorMessage('');

      await mutation();

      setPassword('');
      setConfirmPassword('');
    };
  }

  return (
    <Mutation
      mutation={RESET_PASSWORD_MUTATION}
      variables={{ resetToken, password }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(resetPassword, { error, loading }) => (
        <Form onSubmit={createSubmissionHandler(resetPassword)} method="post">
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Reset your password</h2>

            <Error error={error || (errorMessage ? { message: errorMessage } : null)} />

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

            <label htmlFor="confirmPassword">
              Confirm your password
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={createChangeHandler(setConfirmPassword)}
                required
              />
            </label>

            <button type="submit">Reset{loading ? 'ting' : ''} password</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired,
};

export default Reset;
