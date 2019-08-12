import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import Error from 'components/ErrorMessage';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM($itemId: ID!) {
    item(where: { id: $itemId }) {
      id
      title
      description
      largeImage
    }
  }
`;

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SingleItem = ({ itemId }) => {
  const { data, error, loading } = useQuery(SINGLE_ITEM_QUERY, { variables: { itemId } });

  if (loading) return <p>Loading...</p>;
  if (error) return <Error error={error} />;
  if (!data.item) return <p>No item found for ID '{itemId}'</p>;

  const { item } = data;
  return (
    <SingleItemStyles>
      <Head>
        <title>{item.title} | Sick Fits!</title>
      </Head>
      <img src={item.largeImage} alt={item.title} />
      <div className="details">
        <h2>{item.title}</h2>
        <p>{item.description}</p>
      </div>
    </SingleItemStyles>
  );
};

export default SingleItem;
