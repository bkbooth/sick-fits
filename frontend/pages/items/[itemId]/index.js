import { useRouter } from 'next/router';

const ItemPage = () => {
  const {
    query: { itemId },
  } = useRouter();

  return (
    <div>
      <p>Item {itemId}!</p>
    </div>
  );
};

export default ItemPage;
