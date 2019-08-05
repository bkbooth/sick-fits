import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Item from './Item';

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS {
    items {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

const Items = () => (
  <Center>
    <Query query={ALL_ITEMS_QUERY}>
      {({ data, error, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <Error error={error} />;
        return (
          <ItemsList>
            {data.items.map(item => (
              <Item item={item} key={item.id} />
            ))}
          </ItemsList>
        );
      }}
    </Query>
  </Center>
);

export default Items;
