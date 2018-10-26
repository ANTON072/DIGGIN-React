import { combineReducers } from "redux"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { fork, all } from "redux-saga/effects"

import app, { PostsAppProps } from "./app"
import list, { listSaga, PostListProps } from "./list"

export interface PostProps {
  app: PostsAppProps
  list: PostListProps
}

const postsPersistConfig = {
  key: "posts",
  storage,
  whitelist: ["list"]
}

export function* postsSaga() {
  yield all([fork(listSaga)])
}

export default persistReducer(
  postsPersistConfig,
  combineReducers({ app, list })
)
