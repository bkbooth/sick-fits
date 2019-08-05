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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [largeImage, setLargeImage] = useState('');

  async function uploadFile(event) {
    const { files } = event.currentTarget;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sick-fits');

    const res = await fetch('https://api.cloudinary.com/v1_1/bkbooth/image/upload', {
      method: 'POST',
      body: data,
    });
    const file = await res.json();
    setImage(file.secure_url);
    setLargeImage(file.eager[0].secure_url);
  }

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
            <label htmlFor="file">
              Image
              <input
                type="file"
                name="file"
                id="file"
                placeholder="Upload an image"
                onChange={uploadFile}
                required
              />
              {image && <img src={image} width="200" alt="Uploaded image preview" />}
            </label>

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
