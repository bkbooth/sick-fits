import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { ALL_ITEMS_QUERY } from 'components/Items';

export const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM($itemId: ID!) {
    deleteItem(id: $itemId) {
      id
    }
  }
`;

const DeleteItem = ({ itemId }) => {
  const [deleteItem, { loading }] = useMutation(DELETE_ITEM_MUTATION, {
    variables: { itemId },
    update: cacheUpdate,
  });

  function handleDeleteItem() {
    confirm('Are you sure you want to delete this item?') &&
      deleteItem().catch(error => alert(error.message));
  }

  function cacheUpdate(cache, payload) {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }

  return (
    <button onClick={handleDeleteItem} disabled={loading}>
      🗑️ Delet{loading ? 'ing' : 'e'} item
    </button>
  );
};

DeleteItem.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default DeleteItem;
