import React from 'react';
import { useMutation } from '@apollo/react-hooks';
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
  const [signout] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleSignout(event) {
    event.preventDefault();
    await signout();
    Router.push('/signup');
  }

  return <button onClick={handleSignout}>Signout</button>;
};

export default Signout;
