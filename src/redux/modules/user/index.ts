import { combineReducers } from "redux"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { fork, all } from "redux-saga/effects"

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

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["entity"]
}

export default persistReducer(
  userPersistConfig,
  combineReducers({ app, entity })
)

/**
 * misc
 */
export const withLoggedIn = withProps(({ user }: { user: UserProps }) => {
  return { loggedIn: user.entity.userId != null }
})
