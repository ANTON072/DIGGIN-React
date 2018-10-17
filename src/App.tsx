import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { compose } from "recompose"

import GlobalStyles from "components/GlobalStyles"
import LoginPageContainer from "containers/PageLoginContainer"

const App: React.SFC<{}> = () => (
  <BrowserRouter>
    <React.Fragment>
      <GlobalStyles />
      <Switch>
        <Route path="/login" component={LoginPageContainer} />
      </Switch>
      {/* <LoggedIn loggedIn={true} /> */}
    </React.Fragment>
  </BrowserRouter>
)

export default compose()(App)
