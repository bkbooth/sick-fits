import { useRouter } from 'next/router';
import Reset from 'components/Reset';

const ResetPage = () => {
  const router = useRouter();
  if (!router) return null;

  return (
    <div>
      <Reset resetToken={router.query.resetToken} />
    </div>
  );
};

export default ResetPage;
