import { MockedProvider } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import wait from 'waait';
import RequestReset, { REQUEST_RESET_MUTATION } from 'components/RequestReset';

const mocks = [
  {
    request: { query: REQUEST_RESET_MUTATION, variables: { email: 'test@example.com' } },
    result: { data: { requestReset: { __typename: 'Message', message: 'Success!' } } },
  },
];

describe('<RequestReset />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    expect(wrapper.find('form[data-test="form"]')).toMatchSnapshot();
  });

  it('calls the request reset mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    wrapper
      .find('input[name="email"]')
      .simulate('change', { target: { value: 'test@example.com' } });
    wrapper.find('form').simulate('submit');
    await act(() => wait());
    wrapper.update();
    expect(wrapper.find('p[data-test="success"]').text()).toContain(
      'Your password reset link has been sent to your email address.'
    );
  });
});
