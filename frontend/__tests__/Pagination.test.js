import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
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

async function render(numberOfItems, page) {
  const wrapper = mount(
    <MockedProvider mocks={makeMocksFor(numberOfItems)}>
      <Pagination page={page} />
    </MockedProvider>
  );
  await act(() => wait());
  wrapper.update();
  return wrapper;
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
    const wrapper = await render(18, 1);
    expect(wrapper.find('[data-test="total-pages"]').text()).toBe('5');
    expect(wrapper.find('div[data-test="pagination"]')).toMatchSnapshot();
  });

  it('disables prev button on the first page', async () => {
    const wrapper = await render(18, 1);
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(true);
    expect(wrapper.find('a.next').prop('aria-disabled')).toBe(false);
  });

  it('disables next button on the last page', async () => {
    const wrapper = await render(18, 5);
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(false);
    expect(wrapper.find('a.next').prop('aria-disabled')).toBe(true);
  });

  it('enables all buttons on a middle page', async () => {
    const wrapper = await render(18, 3);
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(false);
    expect(wrapper.find('a.next').prop('aria-disabled')).toBe(false);
  });
});
