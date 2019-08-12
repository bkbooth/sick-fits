import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import wait from 'waait';
import { fakeItem } from 'lib/testUtils';
import SingleItem, { SINGLE_ITEM_QUERY } from 'components/SingleItem';

describe('<SingleItem />', () => {
  it('renders with proper data', async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { itemId: '123' } },
        result: { data: { item: fakeItem() } },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem itemId="123" />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading...');

    await wait();
    wrapper.update();
    expect(wrapper.find('h2')).toMatchSnapshot();
    expect(wrapper.find('img')).toMatchSnapshot();
    expect(wrapper.find('p')).toMatchSnapshot();
  });

  it('errors with a not found item', async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { itemId: '123' } },
        result: { errors: [{ message: 'Item not found' }] },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem itemId="123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find('[data-test="graphql-error"]')).toMatchSnapshot();
  });
});
