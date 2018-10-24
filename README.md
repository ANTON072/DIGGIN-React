# DIGGIN-React

## Database (Cloud Firestore)

**Post**

```
{
  [POST_ID]: {
    repo_id: :string,
    repo_full_name: :string,
    repo_html_url: :string,
    repo_avatar_url: :string,
    repo_owner_login: :string,
    repo_description: :string,
    created_at: :Timestamp,
    updated_at: :Timestamp,
    text: :string,
    user: {
      user_id: :string,
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
        user_id: :string,
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

```
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

```
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
