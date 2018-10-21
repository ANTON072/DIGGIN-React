import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose, withStateHandlers } from "recompose"
import {
  EditableText,
  Card,
  Intent,
  H2,
  Button,
  Spinner
} from "@blueprintjs/core"

import loadingStyle from "helpers/loadingStyle"
import { UserProps } from "redux/modules/user"
import Avatar from "components/Avatar"

export const EditPost: React.SFC<{}> = ({ user }) => {
  const { login, avatarUrl, htmlUrl, name, loading } = user
  return (
    <Root>
      <Wrapper>
        <Avatar
          className={loadingStyle(loading)}
          avatarUrl={avatarUrl}
          width={40}
          height={40}
          alt={login}
        />
        <Form>
          <p>Let's share the React library you dug at Github.</p>
          <H2>
            <EditBlock intent={Intent.PRIMARY} placeholder="username/repo" />
          </H2>
          <RepoBlock>
            <Loading size={20} />
          </RepoBlock>
          <EditBlock multiline minLines={3} placeholder="Input your report." />
          <ButtonBlock>
            <PostButton disabled type="submit" intent={Intent.PRIMARY}>
              POST
            </PostButton>
          </ButtonBlock>
        </Form>
      </Wrapper>
    </Root>
  )
}

const Root = styled(Card)`
  position: relative;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const RepoBlock = styled.div`
  display: flex;
  width: 100%;
`

const Loading = styled(Spinner)`
  /* position: absolute;
  top: 50%;
  left: 215px; */
`

const Form = styled.form`
  width: calc(100% - 55px);
`

const ButtonBlock = styled.div`
  margin-top: 15px;
  text-align: right;
`

const PostButton = styled(Button)`
  width: 30%;
`

const EditBlock = styled(EditableText)`
  /* width: 100%; */
  margin-top: 15px;
  background-color: #fff;
`

const mapStateToProps = ({ user }: { user: UserState }) => ({
  user
})

export default compose(connect(mapStateToProps))(EditPost)
