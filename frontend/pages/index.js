import { useRouter } from 'next/router';
import Items from 'components/Items';

const HomePage = () => {
  const {
    query: { page },
  } = useRouter();

  return (
    <div>
      <Items page={parseFloat(page) || 1} />
    </div>
  );
};

export default HomePage;
