import { shallow } from 'enzyme';
import Item from 'components/Item';

const fakeItem = {
  id: 'abc123',
  title: 'Testing item',
  description: 'A really testable item',
  price: 5000,
  image: 'item.jpg',
  largeImage: 'yugeitem.jpg',
};

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders the title and price tag', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    expect(wrapper.find('PriceTag').text()).toBe('$50');
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders the image', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const image = wrapper.find('img');
    expect(image.prop('src')).toBe(fakeItem.image);
    expect(image.prop('alt')).toBe(fakeItem.title);
  });

  it('renders the buttoms', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });
});
