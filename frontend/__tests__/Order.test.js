import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fakeOrder } from 'lib/testUtils';
import Order, { SINGLE_ORDER_QUERY } from 'components/Order';

async function render(mocks, orderId) {
  const wrapper = mount(
    <MockedProvider mocks={mocks}>
      <Order orderId={orderId} />
    </MockedProvider>
  );
  await act(() => wait());
  wrapper.update();
  return wrapper;
}

describe('<Order />', () => {
  it('renders and matches snapshot', async () => {
    const order = fakeOrder();
    const mocks = [
      {
        request: { query: SINGLE_ORDER_QUERY, variables: { orderId: order.id } },
        result: { data: { order } },
      },
    ];
    const wrapper = await render(mocks, order.id);
    expect(wrapper.find('div[data-test="order"]')).toMatchSnapshot();
  });

  it('errors with a not found order', async () => {
    const mocks = [
      {
        request: { query: SINGLE_ORDER_QUERY, variables: { orderId: 'invalid-id' } },
        error: new Error('Order not found'),
      },
    ];
    const wrapper = await render(mocks, 'invalid-id');
    expect(wrapper.find('[data-test="graphql-error"]')).toMatchSnapshot();
  });
});
