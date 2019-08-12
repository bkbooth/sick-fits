import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Signin from 'components/Signin';
import { CURRENT_USER_QUERY } from 'components/User';

const PleaseSignin = ({ children }) => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <p>Loading...</p>;

  if (!data.me)
    return (
      <>
        <p>Please sign in before continuing</p>
        <Signin redirect={false} />
      </>
    );
  return children;
};

export default PleaseSignin;
