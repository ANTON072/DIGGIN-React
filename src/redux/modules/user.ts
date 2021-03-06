import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { call, fork, put, take, all, select } from "redux-saga/effects"
import firebase from "firebase/app"
import * as R from "ramda"
import { withProps } from "recompose"
import camelcaseKeys from "camelcase-keys"
import { Intent } from "@blueprintjs/core"
import { DateTime } from "luxon"

import firebaseApp from "firebase"
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
  createdAt: number | undefined
  updatedAt: number | undefined
}

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  login: actionCreator.async<{}, {}, {}>("user/LOGIN"),
  logout: actionCreator.async("user/LOGOUT"),
  register: actionCreator.async<
    { loggedIn: boolean; githubId?: string; userId?: string },
    UserProps,
    {}
  >("user/REGISTER")
}

/**
 * Saga
 */
function* registerWorker() {
  while (true) {
    const {
      payload: { githubId, userId, loggedIn }
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
      const registerData = { ...filteredJson, githubId, userId }
      const db = firebaseApp.firestore
      const userRef = db.doc(`User/${userId}`)
      const meRef = yield call([userRef, userRef.get])
      const me = meRef.data()
      const now = DateTime.local()
        .toUTC()
        .toMillis()
      if (me) {
        // 登録済み
        registerData.updatedAt = now
        registerData.createdAt = me.createdAt
      } else {
        // 新規登録
        registerData.createdAt = now
        registerData.updatedAt = now
      }
      yield call([userRef, userRef.set], registerData)

      // yield call([userRef, userRef.set], registerData)
      // userRef.set(registerData)

      // const userModel = userRef.doc(userId).set(registerData)
      // const userModelResponse = yield call(userModel.set, registerData)
      // const userModel = yield call(userRef.doc,)
      // const me = yield call(query.get)
      // console.log(me)
      // const querySnapshot = yield call(
      //   [collection, collection.add],
      //   registerData
      // )
      // console.log(querySnapshot)
      // console.log("querySnapshot:", querySnapshot.length)
      // querySnapshot.forEach(doc => {
      //   console.log(doc.data())
      //   // console.log(`${doc.id} => ${doc.data()}`)
      // })
      // DBに登録
      // const dbResult = yield call([db, db.add], registerData)
      // console.log(dbResult)
      yield put(
        actions.register.done({
          params: { githubId, userId, loggedIn },
          result: registerData
        })
      )
    } catch (error) {
      console.error(error.message)
      yield put(actions.register.failed({ params: {}, error: {} }))
    }
  }
}

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
      console.error(error)
      yield put(
        actions.login.failed({
          params: {},
          error: {}
        })
      )
    }
  }
}

function* logoutWorker() {
  while (true) {
    yield take(actions.logout.started)
    const auth = firebase.auth()
    try {
      yield call([auth, auth.signOut])
      yield put(actions.logout.done({ params: {}, result: {} }))
      AppToaster.show({ message: "ログアウトしました", intent: Intent.PRIMARY })
    } catch (error) {
      console.error(error)
      yield put(actions.logout.failed({ params: {}, error: {} }))
      AppToaster.show({
        message: "ログアウトに失敗しました",
        intent: Intent.DANGER
      })
    }
  }
}

export function* userSaga() {
  yield all([fork(registerWorker), fork(loginWorker), fork(logoutWorker)])
}

/**
 * Initial State
 */

const initialState = {
  loading: false,
  error: false,
  userId: undefined,
  githubId: undefined,
  login: undefined,
  avatarUrl: undefined,
  htmlUrl: undefined,
  name: undefined,
  createdAt: undefined,
  updatedAt: undefined
}

/**
 * Reducer
 */

export default function render(
  state: UserProps = initialState,
  action: Action
): UserProps {
  // Login
  if (isType(action, actions.login.started)) {
    return { ...state, loading: true }
  }
  if (isType(action, actions.login.done)) {
    return { ...state, loading: false }
  }
  if (isType(action, actions.login.failed)) {
    return { ...state, error: true, loading: false }
  }
  // Register
  if (isType(action, actions.register.started)) {
    return { ...state, loading: !action.payload.loggedIn }
  }
  if (isType(action, actions.register.done)) {
    const { params, result } = action.payload
    return {
      ...state,
      ...result,
      loading: false,
      error: false
    }
  }
  if (isType(action, actions.register.failed)) {
    return { ...state, loading: false, error: true }
  }
  // Logout
  if (isType(action, actions.logout.done)) {
    return { ...state, ...initialState }
  }
  return state
}

/**
 * misc
 */
export const withLoggedIn = withProps(({ user }: { user: UserProps }) => {
  return { loggedIn: user.userId != null }
})
