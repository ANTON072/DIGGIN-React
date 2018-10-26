import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  get: actionCreator.async<{}, { posts: string[] }, {}>("posts/fetch")
}

/**
 * Reducer
 */
const initialState = { order: [] }

export default function reducer(state = initialState, action: Action) {
  if (isType(action, actions.get.done)) {
    return { ...state, order: action.payload.result }
  }
  return state
}
