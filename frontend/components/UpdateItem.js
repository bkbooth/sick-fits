import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
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

  function createChangeHandler(setter) {
    return event => {
      const { type, value } = event.currentTarget;
      setter(type === 'number' ? parseFloat(value) : value);
    };
  }

  function createSubmissionHandler(mutation) {
    return async event => {
      event.preventDefault();

      if (title === undefined && description === undefined && price === undefined) return;
      await mutation();

      setTitle(undefined);
      setDescription(undefined);
      setPrice(undefined);
    };
  }

  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{ itemId }}>
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (!data.item) return <p>No Item found for ID '{itemId}'</p>;
        return (
          <Mutation
            mutation={UPDATE_ITEM_MUTATION}
            variables={{ itemId, title, description, price }}
          >
            {(updateItem, { error, loading }) => (
              <Form onSubmit={createSubmissionHandler(updateItem)}>
                <Error error={error} />

                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="title">
                    Title
                    <input
                      type="text"
                      name="title"
                      id="title"
                      placeholder="Title"
                      value={title}
                      defaultValue={data.item.title}
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
                      defaultValue={data.item.price}
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
                      defaultValue={data.item.description}
                      onChange={createChangeHandler(setDescription)}
                      required
                    />
                  </label>

                  <button type="submit">Sav{loading ? 'ing' : 'e'} changes</button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};

export default UpdateItem;
