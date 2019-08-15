import { ApolloConsumer } from '@apollo/react-common';
import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import Router from 'next/router';
import NProgress from 'nprogress';
import { act } from 'react-dom/test-utils';
import { fakeCartItem, fakeOrder, fakeUser } from 'lib/testUtils';
import TakeMyMoney, { CREATE_ORDER_MUTATION } from 'components/TakeMyMoney';
import { CURRENT_USER_QUERY } from 'components/User';

const me = fakeUser();
const cartItem = fakeCartItem();
const order = fakeOrder();
const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...me, cart: [cartItem] } } },
  },
  {
    request: { query: CREATE_ORDER_MUTATION, variables: { token: 'tok_abc123' } },
    result: { data: { createOrder: order } },
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...me, orders: [order] } } },
  },
];

async function render() {
  const wrapper = mount(
    <MockedProvider mocks={mocks}>
      <TakeMyMoney>
        <button>Checkout</button>
      </TakeMyMoney>
    </MockedProvider>
  );
  await act(() => wait());
  wrapper.update();
  return wrapper;
}

describe('<TakeMyMoney />', () => {
  beforeEach(() => {
    Router.push = jest.fn();
    NProgress.start = jest.fn();
    NProgress.done = jest.fn();
  });

  afterEach(() => {
    Router.push.mockReset();
    NProgress.start.mockReset();
    NProgress.done.mockReset();
  });

  it('renders and matches snapshot', async () => {
    const wrapper = await render();
    expect(wrapper.find('ReactStripeCheckout')).toMatchSnapshot();
  });

  it('routes to the order page after order is created', async () => {
    const wrapper = await render();
    await act(async () => {
      wrapper.find('ReactStripeCheckout').prop('token')({ id: 'tok_abc123' });
      await wait();
    });
    expect(Router.push).toHaveBeenCalledTimes(1);
    expect(Router.push).toHaveBeenCalledWith('/orders/[orderId]', `/orders/${order.id}`);
  });

  it('shows the progress bar while creating order', async () => {
    const wrapper = await render();
    await act(async () => {
      wrapper.find('ReactStripeCheckout').prop('token')({ id: 'tok_abc123' });
      await wait();
    });
    expect(NProgress.start).toHaveBeenCalledTimes(1);
  });
});
