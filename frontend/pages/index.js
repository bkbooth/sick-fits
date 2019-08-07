import { useRouter } from 'next/router';
import Items from 'components/Items';

const HomePage = () => {
  const router = useRouter();
  if (!router) return null;

  return <Items page={parseFloat(router.query.page) || 1} />;
};

export default HomePage;
