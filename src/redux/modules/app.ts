import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import produce from "immer"
import { call, fork, put, take, all, select } from "redux-saga/effects"

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()
const SET_LOADING = "app/setLoading"

export const actions = {
  setLoading: actionCreator<{ loading: boolean }>(SET_LOADING)
}

/**
 * Saga
 */
export function* appSaga() {
  yield all([])
}

/**
 * Reducer
 */
type State = {
  loading: boolean
}

const initialState = {
  loading: false
}

export default function reducer(state: State = initialState, action: Action) {
  return produce(state, draft => {
    if (isType(action, actions.setLoading)) {
      draft.loading = action.payload.loading
    }
  })
}
