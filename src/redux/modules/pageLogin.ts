import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { call, fork, put, take, all, select } from "redux-saga/effects"
import * as R from "ramda"
import * as EmailValidator from "email-validator"

export interface Input {
  [key: string]: string
  email: string
  password: string
}

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export interface InputAction {
  inputType: string
  value: string
}

export const actions = {
  input: actionCreator<InputAction>("pageLogin/INPUT"),
  login: actionCreator.async("pageLogin/LOGIN"),
  validate: actionCreator("pageLogin/VALIDATE"),
  validateError: actionCreator<{ error: Input }>("pageLogin/VALIDATE_ERROR")
}

/**
 * Saga
 */
function* validateWorker() {
  while (true) {
    // バリデーション実行
    yield take(actions.input)
    const {
      pageLogin: {
        input: { email, password }
      }
    } = yield select()
    const error: Input = {
      email: "",
      password: ""
    }
    let errorFlg = false
    if (R.isEmpty(email)) {
      error.email = "メールアドレスを入力してください"
      errorFlg = true
    }
    if (R.isEmpty(password)) {
      error.password = "パスワードを入力してください"
      errorFlg = true
    }
    if (!EmailValidator.validate(email)) {
      error.email = "メールアドレスの形式に誤りがあります"
      errorFlg = true
    }
    // if (errorFlg) {
    //   console.log("Error", error)
    //   yield put(actions.validateError(error))
    // }
    console.log("validate worker")
  }
}

export function* pageLoginSaga() {
  yield all([fork(validateWorker)])
}

/**
 * Initial State
 */

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
 * Reducer
 */

export default function reducer(
  state: PageLoginState = initialState,
  action: Action
): PageLoginState {
  if (isType(action, actions.input)) {
    const { inputType, value } = action.payload
    return R.evolve({ input: { [inputType]: R.always(value) } }, state)
  }
  return state
}
