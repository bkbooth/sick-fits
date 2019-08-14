import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fakeCartItem, fakeUser } from 'lib/testUtils';
import Cart, { LOCAL_STATE_QUERY } from 'components/Cart';
import { CURRENT_USER_QUERY } from 'components/User';

const me = fakeUser();
const cart = [fakeCartItem(), fakeCartItem()];
const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...me, cart } } },
  },
  {
    request: { query: LOCAL_STATE_QUERY },
    result: { data: { cartOpen: true } },
  },
];
const resolvers = {
  Mutation: {
    toggleCart() {
      return { data: { cartOpen: true } };
    },
  },
};

describe('<Cart />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks} resolvers={resolvers}>
        <Cart />
      </MockedProvider>
    );
    await act(() => wait());
    wrapper.update();
    expect(wrapper.find('header')).toMatchSnapshot();
    expect(wrapper.find('CartItem')).toHaveLength(2);
  });
});
