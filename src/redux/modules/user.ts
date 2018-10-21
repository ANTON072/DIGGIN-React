import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { call, fork, put, take, all, select } from "redux-saga/effects"
import firebase from "firebase/app"
import * as R from "ramda"
import { withProps } from "recompose"
import camelcaseKeys from "camelcase-keys"
import { Intent } from "@blueprintjs/core"

import { AppToaster } from "factories/toaster"

interface GHProps {
  login: string | undefined
  avatarUrl: string | undefined
  htmlUrl: string | undefined
  name: string | undefined
}

export interface UserProps extends GHProps {
  loading: boolean
  userId: string | undefined
  githubId: string | undefined
  error: boolean
}

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  register: actionCreator.async<
    { githubId?: string; userId?: string },
    UserProps,
    {}
  >("user/REGISTER"),
  logout: actionCreator.async("user/LOGOUT")
}

/**
 * Saga
 */
function* registerWorker() {
  while (true) {
    const {
      payload: { githubId, userId }
    } = yield take(actions.register.started)
    try {
      const api = `https://api.github.com/user/${githubId}`
      const response = yield call(fetch, api)
      const json = yield call([response, response.json])
      if (!response.ok) {
        throw new Error(JSON.stringify(json))
      }
      const keys = ["login", "avatarUrl", "htmlUrl", "name"]
      const snakeJson = camelcaseKeys(json)
      const filteredJson = R.pick<UserProps, string>(keys, snakeJson)
      yield put(
        actions.register.done({
          params: { githubId, userId },
          result: filteredJson
        })
      )
    } catch (error) {
      console.error(error.message)
      yield put(actions.register.failed({ params: {}, error: {} }))
    }
  }
}

function* logoutWorker() {
  while (true) {
    yield take(actions.logout.started)
    const auth = firebase.auth()
    try {
      yield call([auth, auth.signOut])
      AppToaster.show({ message: "ログアウトしました", intent: Intent.PRIMARY })
    } catch (error) {
      console.error(error)
      AppToaster.show({
        message: "ログアウトに失敗しました",
        intent: Intent.DANGER
      })
    }
  }
}

export function* userSaga() {
  yield all([fork(registerWorker), fork(logoutWorker)])
}

/**
 * Initial State
 */

const initialState = {
  loading: true,
  userId: undefined,
  githubId: undefined,
  login: undefined,
  avatarUrl: undefined,
  htmlUrl: undefined,
  name: undefined,
  error: false
}

/**
 * Reducer
 */

export default function render(
  state: UserProps = initialState,
  action: Action
): UserProps {
  if (isType(action, actions.register.started)) {
    return { ...state, loading: true }
  }
  if (isType(action, actions.register.done)) {
    const { params, result } = action.payload
    return {
      ...state,
      ...result,
      loading: false,
      userId: params.userId,
      githubId: params.githubId,
      error: false
    }
  }
  if (isType(action, actions.register.failed)) {
    return { ...state, loading: false, error: true }
  }
  return state
}

/**
 * misc
 */
export function getUserId(): string | null {
  const currentUser = firebase.auth().currentUser
  return currentUser != null ? currentUser.uid : null
}

export const withAppUid = withProps(() => {
  return { appUid: getUserId() }
})

export const withLoggedIn = withProps(() => {
  return { loggedIn: R.is(String, getUserId()) }
})
