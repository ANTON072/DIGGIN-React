import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { injectGlobal } from "styled-components"
import { compose } from "recompose"
import baseStyle from "../misc/baseStyle"
import LoginPageContainer from "containers/PageLoginContainer"

const App: React.SFC<{}> = () => (
  <BrowserRouter>
    <React.Fragment>
      <Switch>
        <Route path="/login" component={LoginPageContainer} />
      </Switch>
      {/* <LoggedIn loggedIn={true} /> */}
    </React.Fragment>
  </BrowserRouter>
)

export default compose()(App)

injectGlobal`
  ${baseStyle}
`
