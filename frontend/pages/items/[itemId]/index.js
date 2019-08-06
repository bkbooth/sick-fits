import { useRouter } from 'next/router';
import SingleItem from 'components/SingleItem';

const ItemPage = () => {
  const router = useRouter();
  if (!router) return null;

  return (
    <div>
      <SingleItem itemId={router.query.itemId} />
    </div>
  );
};

export default ItemPage;
