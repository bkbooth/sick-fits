import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PaginationStyles from 'components/styles/PaginationStyles';
import { ITEMS_PER_PAGE } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({ page }) => (
  <Query query={PAGINATION_QUERY}>
    {({ data: { itemsConnection }, loading }) => {
      if (loading) return null;
      const { count } = itemsConnection.aggregate;
      const pages = Math.ceil(count / ITEMS_PER_PAGE);
      return (
        <PaginationStyles>
          <Head>
            <title>
              Sick Fits! — Page {page} of {pages}
            </title>
          </Head>
          <Link href={{ pathname: 'items', query: { page: page - 1 } }} prefetch>
            <a className="prev" aria-disabled={page <= 1}>
              ← Prev
            </a>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <p>{count} items total</p>
          <Link href={{ pathname: 'items', query: { page: page + 1 } }} prefetch>
            <a className="next" aria-disabled={page >= pages}>
              Next →
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
