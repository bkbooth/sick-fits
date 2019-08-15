import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fakeCartItem, fakeUser } from 'lib/testUtils';
import Nav from 'components/Nav';
import { CURRENT_USER_QUERY } from 'components/User';

const me = fakeUser();

async function render(mocks) {
  const wrapper = mount(
    <MockedProvider mocks={mocks}>
      <Nav />
    </MockedProvider>
  );
  await act(() => wait());
  wrapper.update();
  return wrapper;
}

describe('<Nav />', () => {
  it('renders minimal nav when signed out', async () => {
    const notSignedInMocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: null } },
      },
    ];
    const wrapper = await render(notSignedInMocks);
    const nav = wrapper.find('ul[data-test="nav"]');
    expect(nav).toMatchSnapshot();
    expect(nav.children()).toHaveLength(2);
    expect(nav.find('Link[href="/items"]').exists()).toBe(true);
    expect(nav.find('Link[href="/signup"]').exists()).toBe(true);
  });

  it('renders full nav when signed in', async () => {
    const signedInMocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me } },
      },
    ];
    const wrapper = await render(signedInMocks);
    const nav = wrapper.find('ul[data-test="nav"]');
    expect(nav.children()).toHaveLength(6);
    expect(nav.find('Link[href="/items"]').exists()).toBe(true);
    expect(nav.find('Link[href="/sell"]').exists()).toBe(true);
    expect(nav.find('Link[href="/orders"]').exists()).toBe(true);
    expect(nav.find('Link[href="/me"]').exists()).toBe(true);
    expect(nav.find('[data-test="signout-button"]').exists()).toBe(true);
    expect(nav.find('[data-test="cart-button"]').exists()).toBe(true);
  });

  it('renders the amount of items in the cart', async () => {
    const cart = [fakeCartItem(), fakeCartItem()];
    const signedInWithCartItemsMocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        result: {
          data: { me: { ...me, cart } },
        },
      },
    ];
    const wrapper = await render(signedInWithCartItemsMocks);
    const nav = wrapper.find('ul[data-test="nav"]');
    expect(nav.find('div.count')).toMatchSnapshot();
  });
});
