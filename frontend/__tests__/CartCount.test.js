import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import CartCount from 'components/CartCount';

describe('<CartCount />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<CartCount count={10} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('updates via props', () => {
    const wrapper = shallow(<CartCount count={50} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 10 });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
