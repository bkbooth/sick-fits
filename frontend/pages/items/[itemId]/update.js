import { useRouter } from 'next/router';
import UpdateItem from 'components/UpdateItem';

const UpdateItemPage = () => {
  const router = useRouter();
  if (!router) return null;

  return <UpdateItem itemId={router.query.itemId} />;
};

export default UpdateItemPage;
