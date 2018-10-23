# DIGGIN-React

## Database (Cloud Firestore)

**Post**

```json
{
  [POST_ID]: {
    repo_id: :string,
    repo_title: :string,
    repo_url: :string,
    repo_avatar_url: :string,
    repo_owner_login: :string,
    created_at: :Timestamp,
    updated_at: :Timestamp,
    text: :string,
    user: {
      login: :string,
      html_url: :string,
      avatar_url: :string
    },
    tags: {
      [TAG_ID]: true,
      ...
    },
    favorites: {
      [USER_ID]: true,
      ...
    },
    comments: {
      [COMMENT_ID]: {
        login: :string,
        html_url: :string,
        avatar_url: :string,
        created_at: :Timestamp,
      },
      ...
    }
  },
  ...
}
````

**User**

```json
{
  [USER_ID]: {
    posts: {
      [POST_ID]: true,
      ...
    },
    favorites: {
      [POST_ID]: true,
      ...
    }
  },
  ...
}
```

**Tag**

```json
{
  [TAG_ID]: {
    name: :string,
    created_at: :Timestamp,
    posts: {
      [POST_ID]: true,
      ...
    }
  },
  ...
}
```
