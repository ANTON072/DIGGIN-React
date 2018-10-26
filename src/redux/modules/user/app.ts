import { Action } from "redux"
import { isType } from "typescript-fsa"

import { actions } from "./entity"

export interface UserAppProps {
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
  state: UserAppProps = initialState,
  action: Action
): UserAppProps {
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
  if (isType(action, actions.fetch.failed)) {
    return { ...state, error: true }
  }
  return state
}
