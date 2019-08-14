import { ApolloConsumer } from '@apollo/react-common';
import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fakeCartItem, fakeUser } from 'lib/testUtils';
import RemoveFromCart, { REMOVE_FROM_CART_MUTATION } from 'components/RemoveFromCart';
import { CURRENT_USER_QUERY } from 'components/User';

const me = fakeUser();
const cartItem = fakeCartItem();
const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...me, cart: [cartItem] } } },
  },
  {
    request: { query: REMOVE_FROM_CART_MUTATION, variables: { cartItemId: cartItem.id } },
    result: { data: { removeFromCart: cartItem } },
  },
];

describe('<RemoveFromCart />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart cartItemId={cartItem.id} />
      </MockedProvider>
    );
    expect(wrapper.find('button')).toMatchSnapshot();
  });

  it('removes item from cart', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <RemoveFromCart cartItemId={cartItem.id} />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    const { data: dataBefore } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(dataBefore.me.cart).toHaveLength(1);
    expect(dataBefore.me.cart[0].item.price).toBe(cartItem.item.price);
    wrapper.find('button').simulate('click');
    await act(() => wait());
    const { data: dataAfter } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(dataAfter.me.cart).toHaveLength(0);
  });
});
