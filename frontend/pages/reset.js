import { useRouter } from 'next/router';
import Reset from 'components/Reset';

const ResetPage = () => {
  const router = useRouter();
  if (!router) return null;

  return <Reset resetToken={router.query.resetToken} />;
};

export default ResetPage;
