import { combineReducers } from 'redux';
import userReducer from './user';
import settingsReducer from './settings';

export default combineReducers({
  userReducer,
  settingsReducer
})