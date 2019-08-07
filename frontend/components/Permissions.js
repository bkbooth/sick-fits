import React, { useState } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Error from 'components/ErrorMessage';
import SickButton from 'components/styles/SickButton';
import Table from 'components/styles/Table';

const AVAILABLE_PERMISSIONS = [
  'ADMIN',
  'USER',
  'ITEM_CREATE',
  'ITEM_UPDATE',
  'ITEM_DELETE',
  'PERMISSION_UPDATE',
];

export const ALL_USERS_QUERY = gql`
  query ALL_USERS {
    users {
      id
      email
      name
      permissions
    }
  }
`;

const Permissions = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, error, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <Error error={error} />;
      return (
        <>
          <h2>Manage permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {AVAILABLE_PERMISSIONS.map(permission => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>👇</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions user={user} key={user.id} />
              ))}
            </tbody>
          </Table>
        </>
      );
    }}
  </Query>
);

const UserPermissions = ({ user }) => {
  const [permissions, setPermissions] = useState(user.permissions);

  function handlePermissionChange(event) {
    const { checked, value } = event.currentTarget;
    let updatedPermissions = [...permissions];
    if (checked) updatedPermissions.push(value);
    else updatedPermissions = updatedPermissions.filter(permission => permission !== value);
    setPermissions(updatedPermissions);
  }

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      {AVAILABLE_PERMISSIONS.map(permission => (
        <td key={permission}>
          <label htmlFor={`${user.id}-permission-${permission}`}>
            <input
              type="checkbox"
              id={`${user.id}-permission-${permission}`}
              value={permission}
              checked={permissions.includes(permission)}
              onChange={handlePermissionChange}
            />
          </label>
        </td>
      ))}
      <td>
        <SickButton>Update</SickButton>
      </td>
    </tr>
  );
};

UserPermissions.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Permissions;
