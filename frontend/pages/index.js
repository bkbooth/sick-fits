import { useRouter } from 'next/router';
import Items from 'components/Items';

const HomePage = () => {
  const router = useRouter();
  if (!router) return null;

  return (
    <div>
      <Items page={parseFloat(router.query.page) || 1} />
    </div>
  );
};

export default HomePage;
