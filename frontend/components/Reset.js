import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Router from 'next/router';
import PropTypes from 'prop-types';
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
  const [resetPassword, { error, loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    variables: { resetToken, password },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  function createChangeHandler(setter) {
    return event => setter(event.target.value);
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password must be the same');
      return;
    }
    setErrorMessage('');

    await resetPassword();
    Router.push('/');
  }

  return (
    <Form onSubmit={handleResetPassword} method="post">
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
  );
};

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired,
};

export default Reset;
