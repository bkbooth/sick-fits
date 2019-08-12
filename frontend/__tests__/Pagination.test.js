import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import wait from 'waait';
import Pagination, { PAGINATION_QUERY } from 'components/Pagination';

function makeMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            __typename: 'Aggregate',
            aggregate: { __typename: 'Count', count: length },
          },
        },
      },
    },
  ];
}

describe('<Nav />', () => {
  it('displays a loading message', () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading...');
  });

  it('renders pagination for 18 items', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('[data-test="total-pages"]').text()).toBe('5');
    expect(wrapper.find('div[data-test="pagination"]')).toMatchSnapshot();
  });

  it('disables prev button on the first page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(true);
    expect(wrapper.find('a.next').prop('aria-disabled')).toBe(false);
  });

  it('disables next button on the last page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={5} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(false);
    expect(wrapper.find('a.next').prop('aria-disabled')).toBe(true);
  });

  it('enables all buttons on a middle page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={3} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(false);
    expect(wrapper.find('a.next').prop('aria-disabled')).toBe(false);
  });
});
