import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Error from 'components/ErrorMessage';
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

export const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS($userId: ID!, $permissions: [Permission]!) {
    updatePermissions(userId: $userId, permissions: $permissions) {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = () => {
  const { data, error, loading } = useQuery(ALL_USERS_QUERY);

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
};

const UserPermissions = ({ user }) => {
  const [permissions, setPermissions] = useState(user.permissions);
  const [updatePermissions, { error, loading }] = useMutation(UPDATE_PERMISSIONS_MUTATION, {
    variables: { userId: user.id },
  });

  async function handleUpdatePermissions(event) {
    const { checked, value } = event.target;
    let updatedPermissions = [...permissions];
    if (checked) updatedPermissions.push(value);
    else updatedPermissions = updatedPermissions.filter(permission => permission !== value);
    await updatePermissions({ variables: { permissions: updatedPermissions } });
    setPermissions(updatedPermissions);
  }

  return error ? (
    <tr>
      <td colspan={AVAILABLE_PERMISSIONS.length + 2}>
        <Error error={error} />
      </td>
    </tr>
  ) : (
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
              onChange={handleUpdatePermissions}
              disabled={loading}
            />
          </label>
        </td>
      ))}
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
