import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER {
    me {
      id
      email
      name
      permissions
      cart {
        id
        quantity
        item {
          id
          title
          price
          image
        }
      }
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
