import { combineReducers } from 'redux'
import authTodos from '../../../../common/imallbutton/reducers/authTodos'
import todos from './todos'
import validTodos from "../../../../common/validForm/reducers/validTodos";

import {reducer as formReducer} from 'redux-form'

const rootReducer = combineReducers({
  authTodos:authTodos,
  todos:todos,
  validTodos:validTodos,
  form: formReducer
})

export default rootReducer
