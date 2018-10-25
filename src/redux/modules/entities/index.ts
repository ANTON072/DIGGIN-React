import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import {
  call,
  fork,
  put,
  take,
  takeLatest,
  all,
  select
} from "redux-saga/effects"

import firebaseApp from "firebase"

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  fetch: actionCreator.async<{ category: string }, {}, {}>("entities/fetch")
}

/**
 * Saga
 */
function* fetchWorker() {
  while (true) {
    const {
      payload: { category }
    } = yield take(actions.fetch.started)
    // DBからデータを参照する
    try {
      const db = firebaseApp.firestore
      const postRef = db
        .collection("Post")
        .where("tags", "array-contains", "sample")
      const response = yield call([postRef, postRef.get])
      console.log(response.size)
      response.forEach(post => {
        console.log(post.data())
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export function* entitiesSaga() {
  yield all([fork(fetchWorker)])
}

/**
 * Initial State
 */

/**
 * Reducer
 */
export default function reducer(state = {}, action: Action) {
  return state
}
