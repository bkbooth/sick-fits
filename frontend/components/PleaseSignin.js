import React from 'react';
import { Query } from 'react-apollo';
import Signin from 'components/Signin';
import { CURRENT_USER_QUERY } from 'components/User';

const PleaseSignin = ({ children }) => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data: { me }, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!me)
        return (
          <>
            <p>Please sign in before continuing</p>
            <Signin redirect={false} />
          </>
        );
      return children;
    }}
  </Query>
);

export default PleaseSignin;
