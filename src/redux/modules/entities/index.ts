import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"

import users from "./users"

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {}

/**
 * Reducer
 */
export default function reducer(state: {} = {}, action: Action) {
  return {
    users: users(state.users, action)
  }
}
