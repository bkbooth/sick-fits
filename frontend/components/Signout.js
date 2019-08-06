import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from 'components/User';

export const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT {
    signout {
      message
    }
  }
`;

const Signout = () => (
  <Mutation mutation={SIGNOUT_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
    {signout => <button onClick={signout}>Signout</button>}
  </Mutation>
);

export default Signout;
