import { createStore } from 'easy-peasy';
import storeModel from './storeModel';

const configureStore = () => createStore(storeModel);

export default configureStore;
