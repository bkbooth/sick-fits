import React from 'react';
import Link from 'next/link';
import countCartItems from 'lib/countCartItems';
import CartCount from 'components/CartCount';
import Signout from 'components/Signout';
import ToggleCart from 'components/ToggleCart';
import User from 'components/User';
import NavStyles from 'components/styles/NavStyles';

const Nav = () => (
  <User>
    {({ data }) => (
      <NavStyles data-test="nav">
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {data.me ? (
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
            <Signout data-test="signout-button" />
            <ToggleCart data-test="cart-button">
              My cart
              <CartCount count={countCartItems(data.me.cart)} />
            </ToggleCart>
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
