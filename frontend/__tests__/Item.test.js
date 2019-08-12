import { shallow } from 'enzyme';
import { fakeItem } from 'lib/testUtils';
import Item from 'components/Item';

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<Item item={fakeItem()} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders the title and price tag', () => {
    const wrapper = shallow(<Item item={fakeItem()} />);
    expect(wrapper.find('PriceTag').text()).toBe('$50');
    expect(wrapper.find('Title a').text()).toBe('Testing item');
  });

  it('renders the image', () => {
    const wrapper = shallow(<Item item={fakeItem()} />);
    const image = wrapper.find('img');
    expect(image.prop('src')).toBe('item.jpg');
    expect(image.prop('alt')).toBe('Testing item');
  });

  it('renders the buttoms', () => {
    const wrapper = shallow(<Item item={fakeItem()} />);
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });
});
