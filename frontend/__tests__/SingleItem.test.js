import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fakeItem } from 'lib/testUtils';
import SingleItem, { SINGLE_ITEM_QUERY } from 'components/SingleItem';

describe('<SingleItem />', () => {
  it('renders with proper data', async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { itemId: item.id } },
        result: { data: { item } },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem itemId={item.id} />
      </MockedProvider>
    );
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
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem itemId="invalid-id" />
      </MockedProvider>
    );
    await act(() => wait());
    wrapper.update();
    expect(wrapper.find('[data-test="graphql-error"]')).toMatchSnapshot();
  });
});
