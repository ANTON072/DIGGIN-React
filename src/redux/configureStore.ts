import { createStore, applyMiddleware, combineReducers, Store } from "redux"
import { createBrowserHistory, History } from "history"
import { connectRouter, routerMiddleware } from "connected-react-router"
import createSagaMiddleware from "redux-saga"
import { fork, all } from "redux-saga/effects"
import { composeWithDevTools } from "redux-devtools-extension"

import app, { appSaga } from "./modules/app"

const composeEnhancers = composeWithDevTools({})
const history = createBrowserHistory()
const reducer = combineReducers({ app })
const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]

function* rootSaga() {
  yield all([fork(appSaga)])
}

type Props = {
  history: History
  runSaga: () => void
  store: Store
}

export default (initialState: object = {}): Props => {
  const store = createStore(
    connectRouter(history)(reducer),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  )
  const runSaga = () => sagaMiddleware.run(rootSaga)
  return { store, runSaga, history }
}
