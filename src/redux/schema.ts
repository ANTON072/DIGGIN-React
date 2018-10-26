import { schema } from "normalizr"

export const userSchema = new schema.Entity(
  "users",
  {},
  { idAttribute: "userId" }
)

export const postSchema = new schema.Entity("posts", {
  user: userSchema,
  comments: [{ user: userSchema }]
})
