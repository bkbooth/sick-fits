import React, { useState } from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from 'components/styles/DropDown';

const SEARCH_DEBOUNCE_TIME = 350;

export const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS($searchTerm: String!) {
    items(where: { OR: [{ title_contains: $searchTerm }, { description_contains: $searchTerm }] }) {
      id
      image
      title
    }
  }
`;

const Search = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce(async (client, searchTerm) => {
    setLoading(true);
    const { data } = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm },
    });
    setItems(data.items);
    setLoading(false);
  }, SEARCH_DEBOUNCE_TIME);

  return (
    <SearchStyles>
      <ApolloConsumer>
        {client => (
          <input
            type="search"
            onChange={event => handleSearch(client, event.currentTarget.value)}
          />
        )}
      </ApolloConsumer>
      <DropDown>
        {items.map(item => (
          <DropDownItem key={item.id}>
            <img src={item.image} alt={item.title} width="50" />
            {item.title}
          </DropDownItem>
        ))}
      </DropDown>
    </SearchStyles>
  );
};

export default Search;
