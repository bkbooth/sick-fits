import ApolloClient, { InMemoryCache } from 'apollo-boost';
import withApollo from 'next-with-apollo';
import { LOCAL_STATE_QUERY } from 'components/Cart';
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
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_parent, _args, { cache }, _info) {
            const { cartOpen } = cache.readQuery({ query: LOCAL_STATE_QUERY });
            const result = { data: { cartOpen: !cartOpen } };
            cache.writeData(result);
            return result;
          },
        },
      },
      defaults: {
        cartOpen: false,
      },
    },
  });
}

export default withApollo(createApolloClient);
