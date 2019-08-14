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
  id: casual.uuid,
  title: casual.title,
  description: casual.description,
  price: casual.integer(1000, 30000),
  image: `${casual.word}.jpg`,
  largeImage: `${casual.word}-large.jpg`,
  user: null,
});

export const fakeCartItem = overrides => ({
  __typename: 'CartItem',
  id: casual.uuid,
  quantity: casual.integer(1, 5),
  item: fakeItem(),
  user: fakeUser(),
  ...overrides,
});

export function typeInto(wrapper, { inputType = 'input', name, type = 'text', value }) {
  wrapper
    .find(`${inputType}[name="${name}"]`)
    .simulate('change', { target: { name, type, value } });
}
