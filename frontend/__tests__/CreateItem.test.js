import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import Router from 'next/router';
import { act } from 'react-dom/test-utils';
import { fakeItem, typeInto } from 'lib/testUtils';
import CreateItem, { CREATE_ITEM_MUTATION } from 'components/CreateItem';

const fakeImageUrl = 'https://example.com/images/item.jpg';

describe('<CreateItem />', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          secure_url: fakeImageUrl,
          eager: [{ secure_url: fakeImageUrl }],
        }),
    });
    Router.push = jest.fn();
  });

  afterEach(() => {
    global.fetch.mockReset();
    Router.push.mockReset();
  });

  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    expect(wrapper.find('form[data-test="form"]')).toMatchSnapshot();
  });

  it('uploads a file when changed', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    wrapper.find('#file').simulate('change', { target: { files: ['item.jpg'] } });
    await act(() => wait());
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toMatch(/api\.cloudinary\.com/);
  });

  it('handles state updates', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    typeInto(wrapper, { name: 'title', value: 'Test item' });
    typeInto(wrapper, { name: 'price', value: '50000', type: 'number' });
    typeInto(wrapper, { name: 'description', value: 'This is a test item', inputType: 'textarea' });
    await act(() => wait());
    wrapper.update();
    expect(wrapper.find('#title').prop('value')).toBe('Test item');
    expect(wrapper.find('#price').prop('value')).toBe(50000);
    expect(wrapper.find('#description').prop('value')).toBe('This is a test item');
  });

  it('creates an item when the form is submitted', async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            price: item.price,
            image: fakeImageUrl,
            largeImage: fakeImageUrl,
          },
        },
        result: { data: { createItem: item } },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );
    wrapper.find('#file').simulate('change', { target: { files: [item.image] } });
    typeInto(wrapper, { name: 'title', value: item.title });
    typeInto(wrapper, { name: 'price', value: item.price, type: 'number' });
    typeInto(wrapper, { name: 'description', value: item.description, inputType: 'textarea' });
    await act(() => wait());
    wrapper.find('form[data-test="form"]').simulate('submit');
    await act(() => wait());
    expect(Router.push).toHaveBeenCalledWith('/items/[itemId]', `/items/${item.id}`);
  });
});
