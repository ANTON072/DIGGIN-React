import { Action } from "redux"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { delay } from "redux-saga"
import {
  call,
  fork,
  put,
  take,
  takeLatest,
  all,
  select
} from "redux-saga/effects"
import camelcaseKeys from "camelcase-keys"
import { withProps } from "recompose"
import * as R from "ramda"
import { Intent } from "@blueprintjs/core"

import firebaseApp from "firebase"
import { AppToaster } from "factories/toaster"
import { actions as userActions } from "redux/modules/user/entity"

export interface EditorProps {
  loading: boolean
  inputRepoName: string
  repoId: string | null
  repoFullName: string | null
  repoHtmlUrl: string | null
  repoAvatarUrl: string | null
  repoOwnerLogin: string | null
  repoDescription: string | null
  text: string
  tags: object
}

/**
 * Action Creator
 */
const actionCreator = actionCreatorFactory()

export const actions = {
  inputRepo: actionCreator<{ value: string }>("edit/inputRepo"),
  inputText: actionCreator<{ value: string }>("edit/inputText"),
  fetchRepo: actionCreator<{ value: object }>("edit/fetchRepo"),
  updateTags: actionCreator<{ values: string[] }>("edit/updateTags"),
  submit: actionCreator.async<{}, {}, {}>("edit/submit")
}

/**
 * Saga
 */
let lastRepoName = ""

function* fetchRepoWorker() {
  yield delay(500)
  let {
    editor: { inputRepoName }
  } = yield select()
  if (lastRepoName === inputRepoName) {
    return
  }
  if (inputRepoName) {
    inputRepoName = inputRepoName.trim()
  }
  lastRepoName = inputRepoName
  try {
    const api = `https://api.github.com/repos/${inputRepoName}`
    const response = yield call(fetch, api)
    const reducerJson = {
      repoId: null,
      repoFullName: null,
      repoHtmlUrl: null,
      repoDescription: null,
      repoAvatarUrl: null,
      repoOwnerLogin: null
    }
    if (response.ok) {
      const json = yield call([response, response.json])
      const snakeJson = camelcaseKeys(json, { deep: true })
      yield put(
        actions.fetchRepo({
          value: {
            ...reducerJson,
            repoId: snakeJson.id,
            repoFullName: snakeJson.fullName,
            repoHtmlUrl: snakeJson.htmlUrl,
            repoDescription: snakeJson.description,
            repoAvatarUrl: snakeJson.owner.avatarUrl,
            repoOwnerLogin: snakeJson.owner.login
          }
        })
      )
    } else {
      yield put(actions.fetchRepo({ value: reducerJson }))
    }
  } catch (error) {
    console.error(error)
  }
}

function* inputRepoWorker() {
  yield takeLatest(actions.inputRepo, fetchRepoWorker)
}

function* postWorker() {
  while (true) {
    yield take(actions.submit.started)
    const { user, editor } = yield select()
    const { userId, login, htmlUrl, avatarUrl } = user.entity
    const {
      repoId,
      repoFullName,
      repoHtmlUrl,
      repoAvatarUrl,
      repoOwnerLogin,
      repoDescription,
      text,
      tags
    } = editor
    const sendJson = {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      repoId,
      repoFullName,
      repoHtmlUrl,
      repoAvatarUrl,
      repoOwnerLogin,
      repoDescription,
      text,
      user: {
        userId,
        login,
        htmlUrl,
        avatarUrl
      },
      tags,
      favorites: [],
      comments: []
    }
    // DB登録
    try {
      const db = firebaseApp.firestore
      const postRef = db.collection("Post").doc()
      const userRef = db.doc(`User/${user.entity.userId}`)
      const tagRef = db.collection("Tag")
      const batch = db.batch()
      tags.forEach((name: string) => {
        const newTagRef = tagRef.doc(name)
        batch.set(newTagRef, { createdAt: Date.now() })
      })
      yield call([batch, batch.commit])
      const posts = R.append(postRef.id, user.entity.posts)
      yield call(() =>
        db.runTransaction(async transaction => {
          transaction.set(postRef, sendJson)
          transaction.update(userRef, { posts })
        })
      )
      yield put(userActions.update({ posts }))
      yield put(actions.submit.done({ params: {}, result: {} }))
      AppToaster.show({ message: "投稿しました", intent: Intent.PRIMARY })
    } catch (error) {
      console.error(error)
      yield put(actions.submit.failed({ params: {}, error: {} }))
    }
  }
}

export function* editorSaga() {
  yield all([fork(inputRepoWorker), fork(postWorker)])
}

/**
 * Initial State
 */

const initialState = {
  loading: false,
  inputRepoName: "",
  repoId: null,
  repoFullName: null,
  repoHtmlUrl: null,
  repoAvatarUrl: null,
  repoOwnerLogin: null,
  repoDescription: null,
  text: "",
  tags: []
}

/**
 * Reducer
 */
export default function reducer(
  state: EditorProps = initialState,
  action: Action
): EditorProps {
  if (isType(action, actions.inputRepo)) {
    const { value } = action.payload
    return { ...state, inputRepoName: value }
  }
  if (isType(action, actions.fetchRepo)) {
    const { value } = action.payload
    return { ...state, ...value }
  }
  if (isType(action, actions.inputText)) {
    const { value } = action.payload
    return { ...state, text: value }
  }
  if (isType(action, actions.submit.started)) {
    return { ...state, loading: true }
  }
  if (isType(action, actions.submit.done)) {
    return { ...state, ...initialState }
  }
  if (isType(action, actions.submit.failed)) {
    return { ...state, loading: false }
  }
  if (isType(action, actions.updateTags)) {
    return { ...state, tags: action.payload.values }
  }
  return state
}

/**
 * misc
 */
export const withCardValidate = withProps(
  ({ editor }: { editor: EditorProps }) => {
    return { validCard: editor.repoId != null }
  }
)
