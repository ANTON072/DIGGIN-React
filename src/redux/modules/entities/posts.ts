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
import { normalize, schema } from "normalizr"

import firebaseApp from "firebase"
import { actions as postsActions } from "redux/modules/posts"
import { actions as entitiesActions } from "./index"

/**
 * Saga
 */
function* getWorker() {
  while (true) {
    yield take(postsActions.get.started)
    try {
      const db = firebaseApp.firestore
      const postRef = db
        .collection("Post")
        .orderBy("createdAt")
        .startAt(0)
        .limit(3)
      const snapshots = yield call([postRef, postRef.get])
      const posts: any[] = []
      snapshots.forEach((doc: any) => {
        posts.unshift({ ...doc.data(), id: doc.id })
      })
      const userSchema = new schema.Entity(
        "users",
        {},
        { idAttribute: "userId" }
      )
      const commentSchema = new schema.Entity(
        "comments",
        {},
        { idAttribute: "commentId" }
      )
      const postSchema = new schema.Entity("posts")
      const testSchema = new schema.Entity("posts", {
        users: userSchema,
        comments: [userSchema]
      })
      console.log(normalize(posts, [testSchema]))
      // const normalizeData = normalize(posts, [postSchema])
      const normalizeData = normalize(posts, [postSchema])
      // console.log(normalizeData)
      yield put(
        postsActions.get.done({
          params: {},
          result: normalizeData.result
        })
      )
      yield put(entitiesActions.fetch({ normalizeData, type: "posts" }))
    } catch (error) {
      console.log(error)
    }
  }
}

export function* postsSaga() {
  yield all([fork(getWorker)])
}

/**
 * Reducer
 */
export default function reducer(state = {}, action: Action) {
  return state
}
