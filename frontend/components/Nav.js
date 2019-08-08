import React from 'react';
import { Mutation } from 'react-apollo';
import Link from 'next/link';
import countCartItems from 'lib/countCartItems';
import { TOGGLE_CART_MUTATION } from 'components/Cart';
import CartCount from 'components/CartCount';
import Signout from 'components/Signout';
import User from 'components/User';
import NavStyles from 'components/styles/NavStyles';

const Nav = () => (
  <User>
    {({ data }) => (
      <NavStyles>
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
            <Signout />
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCart => (
                <button onClick={toggleCart}>
                  My cart
                  <CartCount count={countCartItems(data.me.cart)} />
                </button>
              )}
            </Mutation>
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
