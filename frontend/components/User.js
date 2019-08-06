import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER {
    me {
      id
      email
      name
      permissions
    }
  }
`;

const User = ({ children }) => (
  <Query query={CURRENT_USER_QUERY}>{payload => children(payload)}</Query>
);

User.propTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
