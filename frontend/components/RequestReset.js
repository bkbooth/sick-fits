import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
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

  function createChangeHandler(setter) {
    return event => setter(event.currentTarget.value);
  }

  function createSubmissionHandler(mutation) {
    return async event => {
      event.preventDefault();
      await mutation();

      setEmail('');
    };
  }

  return (
    <Mutation mutation={REQUEST_RESET_MUTATION} variables={{ email }}>
      {(requestReset, { called, error, loading }) => (
        <Form onSubmit={createSubmissionHandler(requestReset)} method="post">
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Request a password reset</h2>

            <Error error={error} />

            {!error && !loading && called && (
              <p>Your password reset link has been sent to your email address.</p>
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
      )}
    </Mutation>
  );
};

export default RequestReset;
