import casual from 'casual';

// seed it so we get consistent results
casual.seed(777);

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

export const fakeUser = () => ({
  __typename: 'User',
  id: casual.uuid,
  name: casual.name,
  email: casual.email,
  permissions: ['ADMIN'],
  orders: [],
  cart: [],
});
