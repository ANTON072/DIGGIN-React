import { createStore, applyMiddleware, combineReducers, Store } from "redux"
import createSagaMiddleware from "redux-saga"
import { fork, all } from "redux-saga/effects"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistReducer, Persistor } from "redux-persist"
import storage from "redux-persist/lib/storage"

import app, { appSaga } from "./modules/app"
import user, { userSaga } from "./modules/user"
import entities from "./modules/entities"

const composeEnhancers = composeWithDevTools({})
const reducer = combineReducers({ app, user, entities })
const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"]
}

function* rootSaga() {
  yield all([fork(appSaga), fork(userSaga)])
}

type Props = {
  runSaga: () => void
  store: Store
  persistor: Persistor
}

export default (initialState: object = {}): Props => {
  const store = createStore(
    persistReducer(persistConfig, reducer),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )
  const persistor = persistStore(store)
  const runSaga = () => sagaMiddleware.run(rootSaga)
  return { store, runSaga, persistor }
}
