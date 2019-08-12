import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import Error from 'components/ErrorMessage';
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

const Pagination = ({ page }) => {
  const { data, error, loading } = useQuery(PAGINATION_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <Error error={error} />;

  const { count } = data.itemsConnection.aggregate;
  const pages = Math.ceil(count / ITEMS_PER_PAGE);
  return (
    <PaginationStyles data-test="pagination">
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
        Page {page} of <span data-test="total-pages">{pages}</span>
      </p>
      <p>{count} items total</p>
      <Link href={{ pathname: 'items', query: { page: page + 1 } }} prefetch>
        <a className="next" aria-disabled={page >= pages}>
          Next →
        </a>
      </Link>
    </PaginationStyles>
  );
};

export default Pagination;
