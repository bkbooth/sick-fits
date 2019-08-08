import React from 'react';
import { Mutation } from 'react-apollo';
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
  function createDeleteHandler(mutation) {
    return () =>
      confirm('Are you sure you want to delete this item?') &&
      mutation().catch(error => alert(error.message));
  }

  function cacheUpdate(cache, payload) {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }

  return (
    <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ itemId }} update={cacheUpdate}>
      {(deleteItem, { loading }) => (
        <button onClick={createDeleteHandler(deleteItem)} disabled={loading}>
          🗑️ Delet{loading ? 'ing' : 'e'} item
        </button>
      )}
    </Mutation>
  );
};

DeleteItem.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default DeleteItem;
