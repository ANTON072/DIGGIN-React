import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { call, fork, put, take, all, select } from "redux-saga/effects"
import firebase from "firebase/app"
import * as R from "ramda"
import { withProps } from "recompose"
import camelcaseKeys from "camelcase-keys"
import { Intent } from "@blueprintjs/core"

import { AppToaster } from "factories/toaster"

interface UserProps {
  login: string | undefined
  avatarUrl: string | undefined
  htmlUrl: string | undefined
  name: string | undefined
  company: string | undefined
  blog: string | undefined
  location: string | undefined
  bio: string | undefined
}

export type UserState = {
  loading: boolean
  appUid: string | undefined
  error: boolean
  data: UserProps
}

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  register: actionCreator.async<
    { uid?: string; appUid?: string },
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
      payload: { uid, appUid }
    } = yield take(actions.register.started)
    try {
      const api = `https://api.github.com/user/${uid}`
      const response = yield call(fetch, api)
      const json = yield call([response, response.json])
      if (!response.ok) {
        throw new Error(JSON.stringify(json))
      }
      const keys = [
        "login",
        "avatarUrl",
        "htmlUrl",
        "name",
        "company",
        "blog",
        "location",
        "bio"
      ]
      const snakeJson = camelcaseKeys(json)
      const filteredJson = R.pick<UserProps, string>(keys, snakeJson)
      yield put(
        actions.register.done({
          params: { appUid },
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
  loading: false,
  appUid: undefined,
  error: false,
  data: {
    login: undefined,
    avatarUrl: undefined,
    htmlUrl: undefined,
    name: undefined,
    company: undefined,
    blog: undefined,
    location: undefined,
    bio: undefined
  }
}

/**
 * Reducer
 */

export default function render(
  state: UserState = initialState,
  action: Action
): UserState {
  if (isType(action, actions.register.started)) {
    return { ...state, loading: true }
  }
  if (isType(action, actions.register.done)) {
    const { params, result } = action.payload
    return {
      ...state,
      loading: false,
      appUid: params.appUid,
      data: result,
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
export function getAppUid(): string | undefined {
  const currentUser = firebase.auth().currentUser
  return currentUser != null ? currentUser.uid : undefined
}

export const withAppUid = withProps(() => {
  return { appUid: getAppUid() }
})

export const withLoggedIn = withProps(() => {
  return { loggedIn: R.is(String, getAppUid()) }
})
