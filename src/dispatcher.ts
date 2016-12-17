import { Dispatcher } from 'flux';
import { Action } from './action/action';

const instance = new Dispatcher<Action>();

export default instance;