import { shallow } from 'enzyme'
import ItemComponent from '../components/Item'

const fakeItem = {
  id: 'abc123',
  title: 'My Test Item',
  price: 5000,
  description: 'This is a cool item, but it\'s just a test',
  image: 'test.jpg',
  largeImage: 'test-large.jpg',
}

describe('<Item />', () => {
  it('renders the image properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)

    const img = wrapper.find('img')
    expect(img.props().src).toBe(fakeItem.image)
    expect(img.props().alt).toBe(fakeItem.title)
  })

  it('renders the title and price properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)

    const PriceTag = wrapper.find('PriceTag')
    expect(PriceTag.children().text()).toBe('$50')

    expect(wrapper.find('Title a').text()).toBe(fakeItem.title)
  })

  it('renders the buttons properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)

    const buttonList = wrapper.find('.buttonList')
    expect(buttonList.children()).toHaveLength(3)
    expect(buttonList.find('Link').exists()).toBe(true)
    expect(buttonList.find('AddToCart').exists()).toBe(true)
    expect(buttonList.find('DeleteItem').exists()).toBe(true)
  })
})
