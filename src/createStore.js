import { createStore as cs, combineReducers, applyMiddleware } from 'redux'
import { pages, activePage, bucket } from './reducers/reducer'
import thunk from 'redux-thunk'

export default function createStore () {
  return cs(combineReducers({ pages, activePage, bucket }), applyMiddleware(thunk))
}
