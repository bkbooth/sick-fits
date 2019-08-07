import CreateItem from 'components/CreateItem';
import PleaseSignin from 'components/PleaseSignin';

const SellPage = () => (
  <div>
    <PleaseSignin>
      <CreateItem />
    </PleaseSignin>
  </div>
);

export default SellPage;
