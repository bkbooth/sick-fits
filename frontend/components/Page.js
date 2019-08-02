import React from 'react';
import Header from './Header';
import Meta from './Meta';

const Page = ({ children }) => (
  <div>
    <Meta />
    <Header />
    {children}
  </div>
);

export default Page;
