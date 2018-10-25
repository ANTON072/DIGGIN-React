import { createStore, applyMiddleware, combineReducers, Store } from "redux"
import createSagaMiddleware from "redux-saga"
import { fork, all } from "redux-saga/effects"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, Persistor } from "redux-persist"

import user, { userSaga } from "./modules/user"
import editor, { editorSaga } from "./modules/editor"
import entities, { entitiesSaga } from "./modules/entities/"

const composeEnhancers = composeWithDevTools({})
const reducer = combineReducers({ user, editor, entities })
const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]

function* rootSaga() {
  yield all([fork(userSaga), fork(editorSaga), fork(entitiesSaga)])
}

type Props = {
  runSaga: () => void
  store: Store
  persistor: Persistor
}

export default (initialState: object = {}): Props => {
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )
  const persistor = persistStore(store)
  const runSaga = () => sagaMiddleware.run(rootSaga)
  return { store, runSaga, persistor }
}
