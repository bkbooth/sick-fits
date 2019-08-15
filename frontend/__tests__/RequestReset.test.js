import { MockedProvider, wait } from '@apollo/react-testing';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { typeInto } from 'lib/testUtils';
import RequestReset, { REQUEST_RESET_MUTATION } from 'components/RequestReset';

function render(mocks = undefined) {
  return mount(
    <MockedProvider mocks={mocks}>
      <RequestReset />
    </MockedProvider>
  );
}

describe('<RequestReset />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = render();
    expect(wrapper.find('form[data-test="form"]')).toMatchSnapshot();
  });

  it('calls the request reset mutation', async () => {
    const mocks = [
      {
        request: { query: REQUEST_RESET_MUTATION, variables: { email: 'test@example.com' } },
        result: { data: { requestReset: { __typename: 'Message', message: 'Success!' } } },
      },
    ];
    const wrapper = render(mocks);
    typeInto(wrapper, { type: 'email', name: 'email', value: 'test@example.com' });
    wrapper.find('form').simulate('submit');
    await act(() => wait());
    wrapper.update();
    expect(wrapper.find('p[data-test="success"]').text()).toContain(
      'Your password reset link has been sent to your email address.'
    );
  });
});
