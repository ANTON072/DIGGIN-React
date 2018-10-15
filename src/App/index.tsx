import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { injectGlobal } from "styled-components"
import { compose } from "recompose"
import baseStyle from "../misc/baseStyle"
import Login from "pages/Login"

export default class App extends React.Component<{}> {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Switch>
            <Route path="/login" component={Login} />
          </Switch>
          {/* <LoggedIn loggedIn={true} /> */}
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

injectGlobal`
  ${baseStyle}
`
