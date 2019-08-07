import React from 'react';
import { Query } from 'react-apollo';
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

const SingleItem = ({ itemId }) => (
  <Query query={SINGLE_ITEM_QUERY} variables={{ itemId }}>
    {({ data, error, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <Error error={error} />;
      if (!data.item) return <p>No Item found for ID '{itemId}'</p>;
      return (
        <SingleItemStyles>
          <Head>
            <title>{data.item.title} | Sick Fits!</title>
          </Head>
          <img src={data.item.largeImage} alt={data.item.title} />
          <div className="details">
            <h2>{data.item.title}</h2>
            <p>{data.item.description}</p>
          </div>
        </SingleItemStyles>
      );
    }}
  </Query>
);

export default SingleItem;
