import { createStore, applyMiddleware, combineReducers, Store } from "redux"
import createSagaMiddleware from "redux-saga"
import { fork, all } from "redux-saga/effects"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistReducer, Persistor } from "redux-persist"
import storage from "redux-persist/lib/storage"

import user, { userSaga } from "./modules/user"
import editor, { editorSaga } from "./modules/editor"
import posts, { postsSaga } from "./modules/posts"
import entities from "./modules/entities/"

const composeEnhancers = composeWithDevTools({})
const reducer = combineReducers({ user, editor, posts, entities })
const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]

function* rootSaga() {
  yield all([fork(userSaga), fork(editorSaga), fork(postsSaga)])
}

type Props = {
  runSaga: () => void
  store: Store
  persistor: Persistor
}

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["entities"]
}
const persistedReducer = persistReducer(persistConfig, reducer)

export default (initialState: object = {}): Props => {
  const store = createStore(
    persistedReducer,
    // reducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )
  const persistor = persistStore(store)
  const runSaga = () => sagaMiddleware.run(rootSaga)
  return { store, runSaga, persistor }
}
