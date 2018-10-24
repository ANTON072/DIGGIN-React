import * as React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators, Dispatch } from "redux"
import { compose, withHandlers } from "recompose"
import { EditableText, Card, Intent, H2, Button } from "@blueprintjs/core"

import loadingStyle from "helpers/loadingStyle"
import { UserProps } from "redux/modules/user"
import {
  actions as editActions,
  withCardValidate,
  EditorProps
} from "redux/modules/editor"
import Avatar from "components/Avatar"
import { withLoggedIn } from "redux/modules/user"
import GithubCard from "components/GithubCard"

interface EnhancedProps {
  user: UserProps
  editor: EditorProps
  loggedIn: boolean
  validCard: boolean
  inputRepo: ({ value }: { value: string }) => void
  inputText: ({ value }: { value: string }) => void
  submit: () => void
  handleSubmit: React.FormEventHandler<HTMLFormElement>
}

export const EditPost: React.SFC<EnhancedProps> = ({
  user,
  editor,
  loggedIn,
  inputRepo,
  inputText,
  validCard,
  handleSubmit
}) => {
  const { loading } = user.app
  const { login, avatarUrl } = user.entity
  if (!loggedIn) {
    return <React.Fragment />
  }
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
        <Form onSubmit={handleSubmit}>
          <p>Let's share the React library you dug at Github.</p>
          <H2>
            <EditBlock
              intent={Intent.PRIMARY}
              placeholder="username/repo"
              value={editor.inputRepoName}
              onChange={value => inputRepo({ value })}
            />
          </H2>
          {validCard && (
            <RepoBlock>
              <GithubCard
                data={{
                  fullName: editor.repoFullName,
                  htmlUrl: editor.repoHtmlUrl,
                  description: editor.repoDescription,
                  avatarUrl: editor.repoAvatarUrl,
                  login: editor.repoOwnerLogin
                }}
              />
            </RepoBlock>
          )}
          <EditBlock
            multiline
            minLines={3}
            placeholder="Input your report."
            value={editor.text}
            onChange={value => inputText({ value })}
          />
          <ButtonBlock>
            <PostButton
              disabled={
                !validCard || editor.text == null || editor.text.length === 0
              }
              type="submit"
              intent={Intent.PRIMARY}
              loading={editor.loading}
            >
              POST
            </PostButton>
          </ButtonBlock>
        </Form>
      </Wrapper>
    </Root>
  )
}

const mapStateToProps = ({
  user,
  editor
}: {
  user: UserProps
  editor: EditorProps
}) => ({
  user,
  editor
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      inputRepo: editActions.inputRepo,
      inputText: editActions.inputText,
      submit: editActions.submit.started
    },
    dispatch
  )

export default compose<EnhancedProps, EnhancedProps>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withLoggedIn,
  withCardValidate,
  withHandlers<EnhancedProps, {}>({
    handleSubmit: ({ submit }) => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      submit()
    }
  })
)(EditPost)

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
  margin-top: 15px;
  background-color: #fff;
`
