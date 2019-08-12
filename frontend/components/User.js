import { useQuery } from '@apollo/react-hooks';
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

const User = ({ children }) => {
  const payload = useQuery(CURRENT_USER_QUERY);
  return children(payload);
};

User.propTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
