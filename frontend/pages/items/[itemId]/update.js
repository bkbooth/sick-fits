import { useRouter } from 'next/router';
import UpdateItem from 'components/UpdateItem';

const UpdateItemPage = () => {
  const router = useRouter();
  if (!router) return null;

  return (
    <div>
      <UpdateItem itemId={router.query.itemId} />
    </div>
  );
};

export default UpdateItemPage;
