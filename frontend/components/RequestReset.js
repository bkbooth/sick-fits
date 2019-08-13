import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from 'components/ErrorMessage';
import Form from 'components/styles/Form';

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const RequestReset = () => {
  const [email, setEmail] = useState('');
  const [requestReset, { called, error, loading }] = useMutation(REQUEST_RESET_MUTATION, {
    variables: { email },
  });

  function createChangeHandler(setter) {
    return event => setter(event.target.value);
  }

  async function handleRequestReset(event) {
    event.preventDefault();
    await requestReset();
    setEmail('');
  }

  return (
    <Form onSubmit={handleRequestReset} method="post" data-test="form">
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Request a password reset</h2>

        <Error error={error} />

        {!error && !loading && called && (
          <p data-test="success">Your password reset link has been sent to your email address.</p>
        )}

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

        <button type="submit">Request{loading ? 'ing' : ''} reset</button>
      </fieldset>
    </Form>
  );
};

export default RequestReset;
