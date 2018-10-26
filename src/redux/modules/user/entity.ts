import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { call, fork, put, take, all, select } from "redux-saga/effects"
import firebase from "firebase/app"
import * as R from "ramda"
import camelcaseKeys from "camelcase-keys"
import { Intent } from "@blueprintjs/core"

import firebaseApp from "firebase"
import { AppToaster } from "factories/toaster"

interface GHProps {
  login?: string | undefined
  avatarUrl?: string | undefined
  htmlUrl?: string | undefined
  name?: string | undefined
}

export interface UserEntityProps extends GHProps {
  userId?: string | undefined
  githubId?: string | undefined
  updatedAt?: number | undefined
  favorites?: string[]
  posts?: string[]
}

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  login: actionCreator.async<{}, {}, {}>("user/login"),
  logout: actionCreator.async("user/logout"),
  fetch: actionCreator.async<
    { githubId: string; userId: string },
    UserEntityProps,
    {}
  >("user/fetch"),
  update: actionCreator<UserEntityProps>("user/UPDATE")
}

/**
 * Saga
 */
function* fetchWorker() {
  while (true) {
    const {
      payload: { githubId, userId }
    } = yield take(actions.fetch.started)
    try {
      // 登録ユーザーの場合はreducerを更新する
      const db = firebaseApp.firestore
      const userRef = db.doc(`User/${userId}`)
      const me = yield call([userRef, userRef.get])
      let favorites = []
      let posts = []
      if (me.exists) {
        favorites = me.data().favorites
        posts = me.data().posts
      } else {
        // ユーザーインスタンスを新規作成
        console.log("create a new user.")
        yield call([userRef, userRef.set], { favorites: [], posts: [] })
      }
      // Reducer登録
      const api = `https://api.github.com/user/${githubId}`
      const response = yield call(fetch, api)
      const json = yield call([response, response.json])
      if (!response.ok) {
        throw new Error(JSON.stringify(json))
      }
      const keys = ["login", "avatarUrl", "htmlUrl", "name"]
      const snakeJson = camelcaseKeys(json)
      const filteredJson = R.pick<UserEntityProps, string>(keys, snakeJson)
      const registerData = {
        ...filteredJson,
        githubId,
        userId,
        favorites,
        posts
      }
      yield put(
        actions.fetch.done({
          params: { githubId, userId },
          result: registerData
        })
      )
    } catch (error) {
      console.error(error.message)
      yield put(actions.fetch.failed({ params: {}, error: {} }))
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

export function* userEntitySaga() {
  yield all([fork(fetchWorker), fork(loginWorker), fork(logoutWorker)])
}

/**
 * Initial State
 */

const initialState = {
  userId: undefined,
  githubId: undefined,
  login: undefined,
  avatarUrl: undefined,
  htmlUrl: undefined,
  name: undefined,
  updatedAt: undefined,
  favorites: [],
  posts: []
}

/**
 * Reducer
 */
export default function reducer(
  state: UserEntityProps = initialState,
  action: Action
): UserEntityProps {
  // Register
  if (isType(action, actions.fetch.done)) {
    const { result } = action.payload
    return {
      ...state,
      ...result
    }
  }
  // Logout
  if (isType(action, actions.logout.done)) {
    return { ...state, ...initialState }
  }
  // Update
  if (isType(action, actions.update)) {
    return { ...state, ...action.payload }
  }
  return state
}
