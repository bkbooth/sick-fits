import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Form from './styles/Form';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

const CreateItem = () => {
  const [title, setTitle] = useState('Cooler shoes');
  const [description, setDescription] = useState('I love these cooler shoes!');
  const [price, setPrice] = useState(21000);
  const [image] = useState('shoe.jpg');
  const [largeImage] = useState('yugeshoe.jpg');

  function createChangeHandler(setter) {
    return event => {
      const { type, value } = event.currentTarget;
      setter(type === 'number' ? parseFloat(value) : value);
    };
  }

  function createSubmissionHandler(mutation) {
    return async event => {
      event.preventDefault();
      const { data } = await mutation();
      Router.push('/items/[itemId]', `/items/${data.createItem.id}`);
    };
  }

  return (
    <Mutation
      mutation={CREATE_ITEM_MUTATION}
      variables={{ title, description, price, image, largeImage }}
    >
      {(createItem, { loading, error }) => (
        <Form onSubmit={createSubmissionHandler(createItem)}>
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
                onChange={createChangeHandler(setDescription)}
                required
              />
            </label>

            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default CreateItem;
