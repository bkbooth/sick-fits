import casual from 'casual';

// seed it so we get consistent results
casual.seed(777);

export const fakeUser = () => ({
  __typename: 'User',
  id: casual.uuid,
  name: casual.name,
  email: casual.email,
  permissions: ['ADMIN'],
  orders: [],
  cart: [],
});

export const fakeItem = () => ({
  __typename: 'Item',
  id: 'abc123',
  title: 'Testing item',
  description: 'A really testable item',
  price: 5000,
  image: 'item.jpg',
  largeImage: 'yugeitem.jpg',
  user: null,
});

export const fakeCartItem = overrides => ({
  __typename: 'CartItem',
  id: 'def456',
  quantity: 3,
  item: fakeItem(),
  user: fakeUser(),
  ...overrides,
});

export function typeInto(wrapper, { inputType = 'input', name, type = 'text', value }) {
  wrapper
    .find(`${inputType}[name="${name}"]`)
    .simulate('change', { target: { name, type, value } });
}
