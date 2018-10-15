import * as React from "react"
import { Route, Switch } from "react-router-dom"
import { ConnectedRouter } from "connected-react-router"
import { injectGlobal } from "styled-components"
import { compose } from "recompose"
import { History } from "history"
import baseStyle from "../misc/baseStyle"
import Login from "pages/Login"

type Props = {
  history: History
}

export default class App extends React.Component<Props> {
  render() {
    const { history } = this.props

    return (
      <React.Fragment>
        <ConnectedRouter history={history}>
          <React.Fragment>
            <Switch>
              <Route path="/login" component={Login} />
            </Switch>
            {/* <LoggedIn loggedIn={true} /> */}
          </React.Fragment>
        </ConnectedRouter>
      </React.Fragment>
    )
  }
}

injectGlobal`
  ${baseStyle}
`
