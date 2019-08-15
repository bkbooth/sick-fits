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

export const fakeOrderItem = () => ({
  __typename: 'OrderItem',
  id: casual.uuid,
  title: casual.title,
  description: casual.description,
  price: casual.integer(1000, 30000),
  image: `${casual.word}.jpg`,
  quantity: casual.integer(1, 5),
});

export const fakeOrder = () => ({
  __typename: 'Order',
  id: casual.uuid,
  charge: `ch_${casual.uuid.split('-')[4]}`,
  total: casual.integer(10000, 100000),
  items: [fakeOrderItem(), fakeOrderItem()],
  createdAt: casual.date('YYYY-MM-DD[T]HH:mm:ss[Z]'),
  user: fakeUser(),
});

export function typeInto(wrapper, { inputType = 'input', name, type = 'text', value }) {
  wrapper
    .find(`${inputType}[name="${name}"]`)
    .simulate('change', { target: { name, type, value } });
}
