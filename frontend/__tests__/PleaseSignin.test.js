import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import wait from 'waait';
import { fakeUser } from 'lib/testUtils';
import PleaseSignin from 'components/PleaseSignin';
import { CURRENT_USER_QUERY } from 'components/User';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];

const ChildComponent = () => <p>I'm a child!</p>;

describe('<PleaseSignin />', () => {
  it('renders the sign in dialog when not signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignin>
          <ChildComponent />
        </PleaseSignin>
      </MockedProvider>
    );
    await act(() => wait());
    wrapper.update();
    expect(wrapper.text()).toContain('Please sign in before continuing');
    expect(wrapper.find('Signin').exists()).toBe(true);
    expect(wrapper.contains(<ChildComponent />)).toBe(false);
  });

  it('renders the child component when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignin>
          <ChildComponent />
        </PleaseSignin>
      </MockedProvider>
    );
    await act(() => wait());
    wrapper.update();
    expect(wrapper.contains(<ChildComponent />)).toBe(true);
  });
});
