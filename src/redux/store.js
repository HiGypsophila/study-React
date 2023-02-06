import {createStore,combineReducers} from 'redux'
import {CollApsedReducer} from './reducers/CollapsedReducer'
import {LoadingReducer} from './reducers/LoadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
  blacklist:['LoadingReducer']
}
//将多个reducer合并
const reducer=combineReducers({
  CollApsedReducer,
  LoadingReducer
})
const persistedReducer = persistReducer(persistConfig, reducer)
const store=createStore(persistedReducer)
const persistor=persistStore(store)
export {
  store,
  persistor
}

//订阅和发布，让父组件负责
/*
store.dispatch()
store.subsribe()
*/