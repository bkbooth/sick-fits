import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Error from 'components/ErrorMessage';
import Item from 'components/Item';
import Pagination from 'components/Pagination';

const itemsPerPage = process.env.itemsPerPage;

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS($skip: Int = 0, $first: Int = ${itemsPerPage}) {
    items(orderBy: createdAt_DESC, skip: $skip, first: $first) {
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

const Items = ({ page }) => {
  const { data, error, loading } = useQuery(ALL_ITEMS_QUERY, {
    variables: { skip: page * itemsPerPage - itemsPerPage },
  });

  return (
    <Center>
      <Pagination page={page} />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <Error error={error} />
      ) : (
        <ItemsList>
          {data.items.map(item => (
            <Item item={item} key={item.id} />
          ))}
        </ItemsList>
      )}
      <Pagination page={page} />
    </Center>
  );
};

export default Items;
