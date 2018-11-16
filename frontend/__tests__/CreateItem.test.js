import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import Router from 'next/router'
import { MockedProvider } from 'react-apollo/test-utils'
import { fakeItem } from '../lib/testUtils'
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem'

// mock the global fetch API
const dogImage = 'https://dog.com/dog.jpg'
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [{ secure_url: dogImage }],
  })
})

describe('<CreateItem />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )
    const form = wrapper.find('form[data-test="form"]')
    expect(toJSON(form)).toMatchSnapshot()
  })

  it('uploads a file when changes', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )
    const input = wrapper.find('input[type="file"]')
    input.simulate('change', { target: { files: ['fakedog.jpg'] } })
    await wait()
    const component = wrapper.find('CreateItem').instance()
    expect(component.state.image).toEqual(dogImage)
    expect(component.state.largeImage).toEqual(dogImage)

    expect(global.fetch).toHaveBeenCalled()
    global.fetch.mockReset()
  })

  it('handles state update', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )
    wrapper.find('#title').simulate('change', {
      target: { name: 'title', value: 'Testing' },
    })
    wrapper.find('#price').simulate('change', {
      target: { name: 'price', value: '50000', type: 'number' },
    })
    wrapper.find('#description').simulate('change', {
      target: { name: 'description', value: 'This is a really nice item!' },
    })
    expect(wrapper.find('CreateItem').instance().state).toMatchObject({
      title: 'Testing',
      price: 50000,
      description: 'This is a really nice item!',
    })
  })

  it('creates an item when the form is submitted', async () => {
    const item = fakeItem()
    const mocks = [{
      request: {
        query: CREATE_ITEM_MUTATION,
        variables: {
          title: item.title,
          description: item.description,
          price: item.price,
          image: '',
          largeImage: '',
        },
      },
      result: {
        data: {
          createItem: {
            __typename: '',
            ...item,
          },
        },
      },
    }]
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    )
    // simulate someone filling out the form
    wrapper.find('#title').simulate('change', {
      target: { name: 'title', value: item.title },
    })
    wrapper.find('#price').simulate('change', {
      target: { name: 'price', value: item.price, type: 'number' },
    })
    wrapper.find('#description').simulate('change', {
      target: { name: 'description', value: item.description },
    })
    // mock the router
    Router.router = { push: jest.fn() }
    // simulate submitting the form
    wrapper.find('form').simulate('submit')
    await wait(50)
    expect(Router.router.push).toHaveBeenCalled()
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/item',
      query: { id: item.id },
    })
  })
})
