import { useRouter } from 'next/router';
import SingleItem from 'components/SingleItem';

const ItemPage = () => {
  const router = useRouter();
  if (!router) return null;

  return <SingleItem itemId={router.query.itemId} />;
};

export default ItemPage;
