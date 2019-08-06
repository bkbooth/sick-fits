import { useRouter } from 'next/router';
import UpdateItem from 'components/UpdateItem';

const UpdateItemPage = () => {
  const {
    query: { itemId },
  } = useRouter();

  return (
    <div>
      <UpdateItem itemId={itemId} />
    </div>
  );
};

export default UpdateItemPage;
