import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fakeItem } from 'lib/testUtils';
import SingleItem, { SINGLE_ITEM_QUERY } from 'components/SingleItem';

function render(mocks, itemId) {
  return mount(
    <MockedProvider mocks={mocks}>
      <SingleItem itemId={itemId} />
    </MockedProvider>
  );
}

describe('<SingleItem />', () => {
  it('renders with proper data', async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { itemId: item.id } },
        result: { data: { item } },
      },
    ];
    const wrapper = render(mocks, item.id);
    expect(wrapper.text()).toContain('Loading...');

    await act(() => wait());
    wrapper.update();
    expect(wrapper.find('h2')).toMatchSnapshot();
    expect(wrapper.find('img')).toMatchSnapshot();
    expect(wrapper.find('p')).toMatchSnapshot();
  });

  it('errors with a not found item', async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { itemId: 'invalid-id' } },
        error: new Error('Item not found'),
      },
    ];
    const wrapper = render(mocks, 'invalid-id');
    await act(() => wait());
    wrapper.update();
    expect(wrapper.find('[data-test="graphql-error"]')).toMatchSnapshot();
  });
});
