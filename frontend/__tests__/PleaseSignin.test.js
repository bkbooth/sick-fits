import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { fakeUser } from 'lib/testUtils';
import PleaseSignin from 'components/PleaseSignin';
import { CURRENT_USER_QUERY } from 'components/User';

const ChildComponent = () => <p>I'm a child!</p>;

async function render(mocks) {
  const wrapper = mount(
    <MockedProvider mocks={mocks}>
      <PleaseSignin>
        <ChildComponent />
      </PleaseSignin>
    </MockedProvider>
  );
  await act(() => wait());
  wrapper.update();
  return wrapper;
}

describe('<PleaseSignin />', () => {
  it('renders the sign in dialog when not signed in', async () => {
    const notSignedInMocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: null } },
      },
    ];
    const wrapper = await render(notSignedInMocks);
    expect(wrapper.text()).toContain('Please sign in before continuing');
    expect(wrapper.find('Signin').exists()).toBe(true);
    expect(wrapper.contains(<ChildComponent />)).toBe(false);
  });

  it('renders the child component when signed in', async () => {
    const signedInMocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { me: fakeUser() } },
      },
    ];
    const wrapper = await render(signedInMocks);
    expect(wrapper.contains(<ChildComponent />)).toBe(true);
  });
});
