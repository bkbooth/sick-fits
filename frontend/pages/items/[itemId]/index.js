import { useRouter } from 'next/router';
import SingleItem from 'components/SingleItem';

const ItemPage = () => {
  const {
    query: { itemId },
  } = useRouter();

  return (
    <div>
      <SingleItem itemId={itemId} />
    </div>
  );
};

export default ItemPage;
