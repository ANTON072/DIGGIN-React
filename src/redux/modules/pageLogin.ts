import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { call, fork, put, take, all, resolve } from "redux-saga/effects"
import firebase from "firebase/app"

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

type ErrorProps = {
  code: string
  message: string
}

export const actions = {
  login: actionCreator.async<{}, {}, ErrorProps>("pageLogin/LOGIN")
}

/**
 * Saga
 */
function* loginWorker() {
  while (true) {
    yield take(actions.login.started)
    try {
      const provider = new firebase.auth.GithubAuthProvider()
      const auth = firebase.auth()
      yield call([auth, auth.signInWithPopup], provider)
      yield put(
        actions.login.done({
          params: {},
          result: {}
        })
      )
      yield put.resolve
    } catch (error) {
      const { code, message } = error
      yield put(
        actions.login.failed({
          params: {},
          error: { code, message }
        })
      )
    }
  }
}

export function* loginSaga() {
  yield all([fork(loginWorker)])
}

/**
 * Initial State
 */

export type LoginState = {
  loading: boolean
  loggedIn: boolean
  error: ErrorProps
}

const initialState = {
  loading: false,
  loggedIn: false,
  error: {
    code: "",
    message: ""
  }
}

/**
 * Reducer
 */

export default function reducer(
  state: LoginState = initialState,
  action: Action
): LoginState {
  if (isType(action, actions.login.started)) {
    return { ...state, loading: true }
  }
  if (isType(action, actions.login.failed)) {
    const { error } = action.payload
    return { ...state, error, loading: false }
  }
  if (isType(action, actions.login.done)) {
    return { ...state, loading: false, loggedIn: true }
  }
  return state
}
