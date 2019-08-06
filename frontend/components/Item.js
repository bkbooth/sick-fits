import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import formatMoney from 'lib/formatMoney';
import DeleteItem from 'components/DeleteItem';
import ItemStyles from 'components/styles/ItemStyles';
import PriceTag from 'components/styles/PriceTag';
import Title from 'components/styles/Title';

const Item = ({ item }) => (
  <ItemStyles>
    {item.image && <img src={item.image} alt={item.title} />}

    <Title>
      <Link href="/items/[itemId]" as={`/items/${item.id}`}>
        <a>{item.title}</a>
      </Link>
    </Title>
    <PriceTag>{formatMoney(item.price)}</PriceTag>
    <p>{item.description}</p>

    <div className="buttonList">
      <Link href="/items/[itemId]/update" as={`/items/${item.id}/update`}>
        <a>✏️ Edit</a>
      </Link>
      <button>Add to cart</button>
      <DeleteItem itemId={item.id}>Delete</DeleteItem>
    </div>
  </ItemStyles>
);

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
  }),
};

export default Item;
