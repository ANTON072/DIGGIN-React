import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { ThemeProvider } from "styled-components"
import { Colors } from "@blueprintjs/core"
import App from "./App"
import configureStore from "./redux/configureStore"

import "normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"

const { store, runSaga, history } = configureStore({})
console.log(Colors)
const theme = { Colors }

runSaga()
ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App history={history} />
    </ThemeProvider>
  </Provider>,
  document.getElementById("app-root")
)
