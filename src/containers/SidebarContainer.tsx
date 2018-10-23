import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose } from "recompose"

import { actions as userActions, UserProps } from "redux/modules/user"
import SidebarLogo from "components/SidebarLogo"
import SidebarContents, { SidebarProps } from "components/SidebarContents"

export const Sidebar: React.SFC<SidebarProps> = ({
  user,
  handleLogout,
  ...rest
}) => {
  return (
    <Root {...rest}>
      <SidebarLogo />
      <Main>
        <SidebarContents user={user} handleLogout={handleLogout} />
      </Main>
    </Root>
  )
}

const mapStateToProps = ({ user }: { user: UserProps }) => ({
  user
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      handleLogout: userActions.logout.started
    },
    dispatch
  )

export default compose<SidebarProps, {}>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Sidebar)

const Root = styled.div`
  width: 291px;
`

const Main = styled.div`
  padding: 15px;
  margin-top: 15px;
  background-color: #fff;
`
