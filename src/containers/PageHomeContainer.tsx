import * as React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { compose, lifecycle } from "recompose"

const Home: React.SFC<{}> = () => {
  return <div>Home</div>
}

export default compose()(Home)
