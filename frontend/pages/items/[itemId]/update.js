import { useRouter } from 'next/router';

const UpdateItemPage = () => {
  const {
    query: { itemId },
  } = useRouter();

  return (
    <div>
      <p>Update item {itemId}!</p>
    </div>
  );
};

export default UpdateItemPage;
