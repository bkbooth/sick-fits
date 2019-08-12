import React, { useState } from 'react';
import { ApolloConsumer } from '@apollo/react-common';
import Downshift, { resetIdCounter } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import Router from 'next/router';
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
  resetIdCounter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce(async (client, searchTerm) => {
    const { data } = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm },
    });
    setItems(data.items);
    setLoading(false);
  }, SEARCH_DEBOUNCE_TIME);

  function handleSelectItem(item) {
    Router.push('/items/[itemId]', `/items/${item.id}`);
  }

  return (
    <SearchStyles>
      <Downshift onChange={handleSelectItem} itemToString={item => (item ? item.title : '')}>
        {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
          <div>
            <ApolloConsumer>
              {client => (
                <input
                  {...getInputProps({
                    type: 'search',
                    name: 'search',
                    id: 'search',
                    className: loading ? 'loading' : '',
                    placeholder: 'Search for an item...',
                    onChange: event =>
                      setLoading(true) || handleSearch(client, event.currentTarget.value),
                  })}
                />
              )}
            </ApolloConsumer>
            {isOpen && (
              <DropDown>
                {items.map((item, index) => (
                  <DropDownItem
                    {...getItemProps({
                      item,
                      highlighted: index === highlightedIndex,
                      key: item.id,
                    })}
                  >
                    <img src={item.image} alt={item.title} width="50" />
                    {item.title}
                  </DropDownItem>
                ))}
                {!items.length && !loading && (
                  <DropDownItem>No items found for '{inputValue}'</DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
};

export default Search;
