import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';
import Error from 'components/ErrorMessage';
import Item from 'components/Item';
import Pagination from 'components/Pagination';
import { ITEMS_PER_PAGE } from '../config';

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS($skip: Int = 0, $first: Int = ${ITEMS_PER_PAGE}) {
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

const Items = ({ page }) => (
  <Center>
    <Pagination page={page} />
    <Query query={ALL_ITEMS_QUERY} variables={{ skip: page * ITEMS_PER_PAGE - ITEMS_PER_PAGE }}>
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
    <Pagination page={page} />
  </Center>
);

export default Items;
