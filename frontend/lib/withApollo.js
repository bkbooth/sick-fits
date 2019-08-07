import ApolloClient, { InMemoryCache } from 'apollo-boost';
import withApollo from 'next-with-apollo';
import { GRAPHQL_URL } from '../config';

function createApolloClient({ headers, initialState }) {
  return new ApolloClient({
    uri: GRAPHQL_URL,
    cache: new InMemoryCache().restore(initialState || {}),
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
  });
}

export default withApollo(createApolloClient);
