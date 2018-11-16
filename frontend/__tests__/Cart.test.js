import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeUser, fakeCartItem } from '../lib/testUtils'
import { CURRENT_USER_QUERY } from '../components/User'
import Cart, { LOCAL_STATE_QUERY } from '../components/Cart'

const mocks = [{
  request: { query: CURRENT_USER_QUERY },
  result: {
    data: {
      me: {
        ...fakeUser(),
        cart: [fakeCartItem()],
      },
    },
  },
}, {
  request: { query: LOCAL_STATE_QUERY },
  result: { data: { cartOpen: true } },
}]

describe('<Cart />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Cart />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('header'))).toMatchSnapshot()
    expect(wrapper.find('CartItem')).toHaveLength(1)
  })
})
