import { ApolloConsumer } from '@apollo/react-common';
import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import Router from 'next/router';
import { act } from 'react-dom/test-utils';
import { fakeUser, typeInto } from 'lib/testUtils';
import Signup, { SIGNUP_MUTATION } from 'components/Signup';
import { CURRENT_USER_QUERY } from 'components/User';

const me = fakeUser();
const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: { name: me.name, email: me.email, password: 'testing123' },
    },
    result: { data: { signup: me } },
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } },
  },
];

describe('<Signup />', () => {
  beforeEach(() => {
    Router.push = jest.fn();
  });

  afterEach(() => {
    Router.push.mockReset();
  });

  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );
    expect(wrapper.find('form[data-test="form"]')).toMatchSnapshot();
  });

  it('calls the mutation when form is submitted', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <Signup />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    typeInto(wrapper, { name: 'name', value: me.name });
    typeInto(wrapper, { name: 'email', type: 'email', value: me.email });
    typeInto(wrapper, { name: 'password', type: 'password', value: 'testing123' });
    await act(() => wait());
    wrapper.find('form[data-test="form"]').simulate('submit');
    await act(() => wait());
    wrapper.update();
    expect(Router.push).toHaveBeenCalledTimes(1);
    expect(Router.push).toHaveBeenCalledWith('/');
    const { data } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(data.me).toMatchObject(me);
  });
});
