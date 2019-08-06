import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import withApollo from 'lib/withApollo';
import Page from 'components/Page';

class MyApp extends App {
  render() {
    const { apollo, Component } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(MyApp);
