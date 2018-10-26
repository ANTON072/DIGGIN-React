import { Action } from "redux"
import { isType } from "typescript-fsa"

import { actions } from "./list"

export interface PostsAppProps {
  loading: boolean
  error: boolean
}

/**
 * Initial State
 */

const initialState = {
  loading: false,
  error: false
}

/**
 * Reducer
 */

export default function render(
  state: PostsAppProps = initialState,
  action: Action
): PostsAppProps {
  // Login
  if (isType(action, actions.get.started)) {
    return { ...state, loading: true }
  }
  if (isType(action, actions.get.done)) {
    return { ...state, loading: false }
  }
  if (isType(action, actions.get.failed)) {
    return { ...state, error: true, loading: false }
  }
  return state
}
