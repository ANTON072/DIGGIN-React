# DIGGIN-React

## Database (Cloud Firestore)

**Post**

```
{
  [POST_ID]: {
    repoId: :string,
    repoFullName: :string,
    repoHtmlUrl: :string,
    repoAvatarUrl: :string,
    repoOwnerLogin: :string,
    repoDescription: :string,
    createdAt: :Timestamp,
    updatedAt: :Timestamp,
    text: :string,
    user: {
      userId: :string,
      login: :string,
      htmlUrl: :string,
      avatarUrl: :string
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
        userId: :string,
        login: :string,
        htmlUrl: :string,
        avatarUrl: :string,
        createdAt: :Timestamp,
        text: :string
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
