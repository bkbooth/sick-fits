import { mount } from 'enzyme'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeUser } from '../lib/testUtils'
import PleaseSignin from '../components/PleaseSignin'
import { CURRENT_USER_QUERY } from '../components/User'

const notSignedInMocks = [{
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: null } },
}]

const signedInMocks = [{
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me: fakeUser() } },
}]

describe('<PleaseSignin />', () => {
  it('renders the sign in dialog for logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignin />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Please Sign In before continuing...')

    const Signin = wrapper.find('Signin')
    expect(Signin.exists()).toBe(true)
  })

  it('renders the children when the user is signed in', async () => {
    const Hey = () => <p>Hey!</p>
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignin>
          <Hey />
        </PleaseSignin>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(wrapper.contains(<Hey />)).toBe(true)
  })
})
