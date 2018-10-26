import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { withProps } from "recompose"
import { normalize, denormalize } from "normalizr"
import {
  call,
  fork,
  put,
  take,
  takeLatest,
  all,
  select
} from "redux-saga/effects"

import * as schemas from "redux/schema"
import { actions as entitiesActions } from "redux/modules/entities"
import firebaseApp from "firebase"

export type PostListProps = {
  order: string[]
}

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  get: actionCreator.async<{}, { order: string[] }, {}>("posts/get")
}

/**
 * Saga
 */
function* getWorker() {
  while (true) {
    yield take(actions.get.started)
    try {
      const db = firebaseApp.firestore
      const postRef = db.collection("Post").orderBy("createdAt")
      // .startAt(0)
      // .limit(10)
      const snapshots = yield call([postRef, postRef.get])
      const posts: any[] = []
      snapshots.forEach((doc: any) => {
        posts.unshift({ ...doc.data(), id: doc.id })
      })
      const normalizeData = normalize(posts, [schemas.postSchema])
      yield put(entitiesActions.fetch({ normalizeData, type: "posts" }))
      yield put(
        actions.get.done({
          params: {},
          result: { order: normalizeData.result }
        })
      )
    } catch (error) {
      console.log(error)
    }
  }
}

export function* listSaga() {
  yield all([fork(getWorker)])
}

/**
 * Reducer
 */
const initialState = { order: [] }

export default function reducer(
  state: PostListProps = initialState,
  action: Action
): PostListProps {
  if (isType(action, actions.get.done)) {
    return { ...state, order: action.payload.result.order }
  }
  return state
}

/**
 * misc
 */
export const withEntities = withProps(({ posts, entities }) => {
  const denormalizeData = denormalize(
    posts.list.order,
    [schemas.postSchema],
    entities
  )
  return { postData: denormalizeData || [] }
})
