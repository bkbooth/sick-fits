import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.alert = console.log;

configure({ adapter: new Adapter() });
