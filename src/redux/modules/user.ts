import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { call, fork, put, take, all, select } from "redux-saga/effects"
import firebase from "firebase/app"
import * as R from "ramda"
import { withProps } from "recompose"
import * as convertKeys from "convert-keys"

export type UserState = {
  appUid: string | null
  login: string | null
  avatarUrl: string | null
  htmlUrl: string | null
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  bio: string | null
}

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  register: actionCreator.async<{ uid: string }, {}, {}>("user/REGISTER")
}

/**
 * Saga
 */
function* userWorker() {
  while (true) {
    const {
      payload: { uid, appUid }
    } = yield take(actions.register.started)
    try {
      const api = `https://api.github.com/user/${uid}`
      const response = yield call(fetch, api)
      const json = yield call([response, response.json])
      console.log({ ...convertKeys.toCamel(json), appUid })
      // yield put(
      //   actions.register.done({
      //     json: { ...convertKeys.toCamel(json), appUid }
      //   })
      // )
    } catch (error) {
      console.log(error)
    }
  }
}

export function* userSaga() {
  yield all([fork(userWorker)])
}

/**
 * Initial State
 */

const initialState = {
  appUid: null,
  login: null,
  avatarUrl: null,
  htmlUrl: null,
  name: null,
  company: null,
  blog: null,
  location: null,
  bio: null
}

/**
 * Reducer
 */

export default function render(
  state: UserState = initialState,
  action: Action
): UserState {
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
