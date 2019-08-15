import { ApolloConsumer } from '@apollo/react-common';
import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fakeCartItem, fakeUser } from 'lib/testUtils';
import AddToCart, { ADD_TO_CART_MUTATION } from 'components/AddToCart';
import { CURRENT_USER_QUERY } from 'components/User';

const me = fakeUser();
const cartItem = fakeCartItem();
const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } },
  },
  {
    request: { query: ADD_TO_CART_MUTATION, variables: { itemId: cartItem.id } },
    result: { data: { addToCart: cartItem } },
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...me, cart: [cartItem] } } },
  },
];

function render() {
  return mount(
    <MockedProvider mocks={mocks}>
      <AddToCart itemId={cartItem.id} />
    </MockedProvider>
  );
}

describe('<AddToCart />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = render();
    expect(wrapper.find('button')).toMatchSnapshot();
  });

  it('adds an item to cart when clicked', async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <AddToCart itemId={cartItem.id} />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    const { data: dataBefore } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(dataBefore.me.cart).toHaveLength(0);
    wrapper.find('button').simulate('click');
    await act(() => wait());
    const { data: dataAfter } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(dataAfter.me.cart).toHaveLength(1);
    expect(dataAfter.me.cart[0].id).toBe(cartItem.id);
    expect(dataAfter.me.cart[0].quantity).toBe(cartItem.quantity);
  });

  it('shows button loading state when clicked', () => {
    const wrapper = render();
    expect(wrapper.text()).toContain('Add to cart');
    expect(wrapper.find('button').prop('disabled')).toBe(false);
    wrapper.find('button').simulate('click');
    expect(wrapper.text()).toContain('Adding to cart');
    expect(wrapper.find('button').prop('disabled')).toBe(true);
  });
});
