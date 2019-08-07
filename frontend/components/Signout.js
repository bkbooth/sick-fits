import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import { CURRENT_USER_QUERY } from 'components/User';

export const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT {
    signout {
      message
    }
  }
`;

const Signout = () => {
  function createSubmissionHandler(mutation) {
    return async event => {
      event.preventDefault();
      await mutation();
      Router.push('/signup');
    };
  }
  return (
    <Mutation mutation={SIGNOUT_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
      {signout => <button onClick={createSubmissionHandler(signout)}>Signout</button>}
    </Mutation>
  );
};

export default Signout;
