import styled from 'styled-components';
import RequestReset from 'components/RequestReset';
import Signin from 'components/Signin';
import Signup from 'components/Signup';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignupPage = () => (
  <Columns>
    <Signup />
    <Signin />
    <RequestReset />
  </Columns>
);

export default SignupPage;
