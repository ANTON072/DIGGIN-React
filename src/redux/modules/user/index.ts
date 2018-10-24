import { combineReducers } from "redux"
import { persistReducer } from "redux-persist"
import { fork, all } from "redux-saga/effects"
import storage from "redux-persist/lib/storage"

import app, { UserAppProps } from "./app"
import entity, { userEntitySaga, UserEntityProps } from "./entity"
import { withProps } from "recompose"

export function* userSaga() {
  yield all([fork(userEntitySaga)])
}

export interface UserProps {
  app: UserAppProps
  entity: UserEntityProps
}

/**
 * misc
 */
export const withLoggedIn = withProps(({ user }: { user: UserProps }) => {
  return { loggedIn: user.entity.userId != null }
})

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["entity"]
}

export default persistReducer(
  userPersistConfig,
  combineReducers({ app, entity })
)
