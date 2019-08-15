import ApolloClient, { InMemoryCache } from 'apollo-boost';
// TODO: remove react-apollo dependency with next-with-apollo is updated
import withApollo from 'next-with-apollo';
import { LOCAL_STATE_QUERY } from 'components/Cart';

function createApolloClient({ headers, initialState }) {
  return new ApolloClient({
    uri: process.env.graphqlUrl,
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
