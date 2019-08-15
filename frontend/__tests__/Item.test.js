import { shallow } from 'enzyme';
import { fakeItem } from 'lib/testUtils';
import Item from 'components/Item';

const item = fakeItem();

function render() {
  return shallow(<Item item={item} />);
}

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders the title and price tag', () => {
    const wrapper = render();
    expect(wrapper.find('PriceTag').text()).toBe('$164.46');
    expect(wrapper.find('Title a').text()).toBe(item.title);
  });

  it('renders the image', () => {
    const wrapper = render();
    const image = wrapper.find('img');
    expect(image.prop('src')).toBe(item.image);
    expect(image.prop('alt')).toBe(item.title);
  });

  it('renders the buttoms', () => {
    const wrapper = render();
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });
});
