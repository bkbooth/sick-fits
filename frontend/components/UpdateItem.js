import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from 'components/ErrorMessage';
import Form from 'components/styles/Form';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM($itemId: ID!) {
    item(where: { id: $itemId }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM($itemId: ID!, $title: String, $description: String, $price: Int) {
    updateItem(id: $itemId, title: $title, description: $description, price: $price) {
      id
      title
      description
      price
    }
  }
`;

const UpdateItem = ({ itemId }) => {
  const [title, setTitle] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [price, setPrice] = useState(undefined);
  const { data, loading: itemLoading } = useQuery(SINGLE_ITEM_QUERY, { variables: { itemId } });
  const [updateItem, { error: updateError, loading: updateLoading }] = useMutation(
    UPDATE_ITEM_MUTATION,
    { variables: { itemId, title, description, price } }
  );

  function createChangeHandler(setter) {
    return event => {
      const { type, value } = event.target;
      setter(type === 'number' ? parseFloat(value) : value);
    };
  }

  async function handleUpdateItem(event) {
    event.preventDefault();

    if (title === undefined && description === undefined && price === undefined) return;
    await updateItem();

    setTitle(undefined);
    setDescription(undefined);
    setPrice(undefined);
  }

  if (itemLoading) return <p>Loading...</p>;
  if (!data.item) return <p>No item found for ID '{itemId}'</p>;

  const { item } = data;
  return (
    <Form onSubmit={handleUpdateItem}>
      <Error error={updateError} />

      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <label htmlFor="title">
          Title
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            value={title}
            defaultValue={item.title}
            onChange={createChangeHandler(setTitle)}
            required
          />
        </label>

        <label htmlFor="price">
          Price
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Price"
            value={price}
            defaultValue={item.price}
            onChange={createChangeHandler(setPrice)}
            required
          />
        </label>

        <label htmlFor="description">
          Description
          <textarea
            name="description"
            id="description"
            placeholder="Enter a description"
            value={description}
            defaultValue={item.description}
            onChange={createChangeHandler(setDescription)}
            required
          />
        </label>

        <button type="submit">Sav{updateLoading ? 'ing' : 'e'} changes</button>
      </fieldset>
    </Form>
  );
};

export default UpdateItem;
