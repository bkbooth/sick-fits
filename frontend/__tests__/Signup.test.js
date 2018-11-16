import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { ApolloConsumer } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeUser } from '../lib/testUtils'
import { CURRENT_USER_QUERY } from '../components/User'
import Signup, { SIGNUP_MUTATION } from '../components/Signup'

function type(wrapper, name, value) {
  wrapper
    .find(`input[name="${name}"]`)
    .simulate('change', { target: { name, value } })
}

const me = fakeUser()
const mocks = [{
  // signup mutation mock
  request: {
    query: SIGNUP_MUTATION,
    variables: {
      email: me.email,
      name: me.name,
      password: 'testing123',
    },
  },
  result: {
    data: { signup: me },
  },
}, {
  // current user query mock
  request: { query: CURRENT_USER_QUERY },
  result: { data: { me } },
}]

describe('<Signup />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    )
    expect(toJSON(wrapper.find('form[data-test="form"]'))).toMatchSnapshot()
  })

  it('calls the mutation properly', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <Signup />
          }}
        </ApolloConsumer>
      </MockedProvider>
    )
    await wait()
    wrapper.update()

    type(wrapper, 'name', me.name)
    type(wrapper, 'email', me.email)
    type(wrapper, 'password', 'testing123')
    wrapper.update()

    wrapper.find('form[data-test="form"]').simulate('submit')
    await wait()

    // query the user out of the apollo client
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(user.data.me).toMatchObject(me)
  })
})
