import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import Router from 'next/router'
import Pagination, { PAGINATION_QUERY } from '../components/Pagination'

Router.router = {
  push() {},
  prefetch() {},
}

function makeMocksFor(length) {
  return [{
    request: { query: PAGINATION_QUERY },
    result: {
      data: {
        itemsConnection: {
          __typename: 'aggregate',
          aggregate: {
            __typename: 'count',
            count: length,
          },
        },
      },
    },
  }]
}

/**
 * Create and return a mounted Pagination wrapper
 *
 * @param {Object}  [options]
 * @param {Number}  [options.length=1]
 * @param {Number}  [options.page=1]
 * @param {Boolean} [options.plzWait=true]
 *
 * @returns {ReactWrapper}
 */
async function makePaginationWrapper({ length, page, plzWait } = {}) {
  length = length == null ? 1 : length
  page = page == null ? 1 : page
  plzWait = plzWait == null ? true : plzWait

  const wrapper = mount(
    <MockedProvider mocks={makeMocksFor(length)}>
      <Pagination page={page} />
    </MockedProvider>
  )
  if (plzWait) {
    await wait()
    wrapper.update()
  }
  return wrapper
}

describe('<Pagination />', () => {
  it('displays a loading message', async () => {
    const wrapper = await makePaginationWrapper({ plzWait: false })
    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders pagination for 18 items', async () => {
    const wrapper = await makePaginationWrapper({ length: 18 })
    expect(wrapper.find('.totalPages').text()).toEqual('5')

    const pagination = wrapper.find('div[data-test="pagination"]')
    expect(toJSON(pagination)).toMatchSnapshot()
  })

  it('disables prev button on first page', async () => {
    const wrapper = await makePaginationWrapper({ length: 18 })
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(true)
    expect(wrapper.find('a.next').prop('aria-disabled')).toBe(false)
  })

  it('disables next button on last page', async () => {
    const wrapper = await makePaginationWrapper({ length: 18, page: 5 })
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(false)
    expect(wrapper.find('a.next').prop('aria-disabled')).toBe(true)
  })

  it('enables all buttons on a middle page', async () => {
    const wrapper = await makePaginationWrapper({ length: 18, page: 3 })
    expect(wrapper.find('a.prev').prop('aria-disabled')).toBe(false)
    expect(wrapper.find('a.next').prop('aria-disabled')).toBe(false)
  })
})
