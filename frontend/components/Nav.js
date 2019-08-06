import React from 'react';
import Link from 'next/link';
import Signout from 'components/Signout';
import User from 'components/User';
import NavStyles from 'components/styles/NavStyles';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me ? (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Signout />
          </>
        ) : (
          <Link href="/signup">
            <a>Signup</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
