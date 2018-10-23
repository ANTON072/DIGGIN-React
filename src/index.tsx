import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { ThemeProvider } from "styled-components"
import { Colors } from "@blueprintjs/core"
import { BrowserRouter } from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

import App from "./App"
import configureStore from "./redux/configureStore"
import firebaseApp from "firebase"

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID
})

firebaseApp.setupFirestore()

function initialize() {
  const { store, runSaga, persistor } = configureStore()
  const theme = { Colors }
  runSaga()
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>,
    document.getElementById("app-root")
  )
}

initialize()
