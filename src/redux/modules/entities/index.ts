import { combineReducers, Action } from "redux"
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
import { mergeWith, isArray } from "lodash"

import posts, { postsSaga } from "./posts"

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  fetch: actionCreator<{ normalizeData: object; type: string }>(
    "entities/fetch"
  )
}

/**
 * Saga
 */
export function* entitiesSaga() {
  yield all([fork(postsSaga)])
}

/**
 * Reducer
 */
const initialState = {
  posts: {}
}

export default function reducer(state = initialState, action: Action) {
  if (isType(action, actions.fetch)) {
    const { normalizeData } = action.payload
    return mergeWith(state, normalizeData.entities, (a, b) => {
      if (isArray(a) && isArray(b)) {
        return b
      }
    })
  }
  return {
    posts: posts(state.posts, action)
  }
}
