import storage from "redux-persist/lib/storage"
import actionCreatorFactory from "typescript-fsa"

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
 * Reducer
 */
const initialState = {
  posts: {},
  users: {}
}

export default function reducer(state = initialState, action: Action) {
  if (action.payload && action.payload.normalizeData) {
    return {
      ...state,
      ...action.payload.normalizeData.entities
    }
  }
  return state
}
