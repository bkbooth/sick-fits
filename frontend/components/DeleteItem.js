import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from 'components/Items';

export const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM($itemId: ID!) {
    deleteItem(id: $itemId) {
      id
    }
  }
`;

const DeleteItem = ({ children, itemId }) => {
  function createDeleteHandler(mutation) {
    return () => confirm('Are you sure you want to delete this item?') && mutation();
  }

  function cacheUpdate(cache, payload) {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }

  return (
    <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ itemId }} update={cacheUpdate}>
      {deleteItem => <button onClick={createDeleteHandler(deleteItem)}>{children}</button>}
    </Mutation>
  );
};

export default DeleteItem;
