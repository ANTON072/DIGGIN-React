import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import produce from "immer"
import { call, fork, put, take, all, select } from "redux-saga/effects"

/**
 * Initial State
 */

export interface Input {
  [key: string]: string
  email: string
  password: string
}

export type PageLoginState = {
  loading: boolean
  input: Input
  error: Input
}

const initialState = {
  loading: false,
  input: {
    email: "",
    password: ""
  },
  error: {
    email: "",
    password: ""
  }
}

/**
 * Actions
 */
export enum ActionType {
  INPUT = "pageLogin/INPUT",
  LOGIN = "pageLogin/LOGIN",
  VALIDATION_ERROR = "pageLogin/VALIDATION_ERROR"
}

export interface InputAction {
  inputType: string
  value: string
}

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  input: actionCreator<InputAction>(ActionType.INPUT),
  login: actionCreator.async(ActionType.LOGIN),
  validationError: actionCreator<{ error: Input }>(ActionType.VALIDATION_ERROR)
}

/**
 * Saga
 */
function* validateWorker() {
  // while (true) {
  //   yield take(ActionType.LOGIN)
  //   // 1.バリデーションの実行
  //   // 2.apiにアクセス
  //   // 3.apiの戻り値確認
  //   // 4.成功
  //   console.log("login request worker")
  // }
}

export function* pageLoginSaga() {
  yield all([fork(validateWorker)])
}

/**
 * Reducer
 */

export default function reducer(
  state: PageLoginState = initialState,
  action: Action
): PageLoginState {
  return produce(state, draft => {
    if (isType(action, actions.input)) {
      const { inputType, value } = action.payload
      draft.input[inputType] = value
    }
  })
}
