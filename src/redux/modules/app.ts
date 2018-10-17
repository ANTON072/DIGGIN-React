import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { call, fork, put, take, all, select } from "redux-saga/effects"

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  initialize: actionCreator.async("app/INITIALIZED")
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
  initialized: boolean
}

const initialState = {
  loading: false,
  initialized: false
}

export default function reducer(state: State = initialState, action: Action) {
  return state
}
