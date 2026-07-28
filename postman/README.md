# Postman — incubator-service

Ready-to-import Postman collection and environment for testing the incubator-service API,
plus a Node validation script. Swagger UI is also available at `http://localhost:3000/api`
(raw spec at `/api-json`).

## Files

| File                                        | Purpose                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| `incubator-service.postman_collection.json` | The request collection (folders + auto-capture scripts).                     |
| `incubator-local.postman_environment.json`  | Local environment (`http://localhost:3000`).                                 |
| `validate.mjs`                              | JSON + URL checks, and an optional cross-check against the live Swagger doc. |

## Import & run

1. In Postman: **Import** → select both JSON files.
2. Top-right environment selector → choose **Incubator Local**.
3. Fill in the admin credentials if yours differ from the defaults:
   - `admin_username` (default `admin`) — must match the server `ADMIN` env var.
   - `admin_password` (default `qwerty`) — must match the server `PASSWORD` env var.
4. Start the API: `yarn start:dev` (listens on port `3000`).
5. **Enable the cookie jar** so refresh/logout/device requests work: Postman stores the
   `refreshToken` cookie automatically after login (see caveat below).

### Linear walkthrough (run folders top to bottom)

1. **Testing** → `DELETE /testing/all-data` — clean slate.
2. **Users** → `POST /users` creates an auto-confirmed user and seeds `user_login` /
   `user_password` (admin-created users skip email confirmation, so they can log in immediately).
3. **Auth** → `POST /auth/login` captures `access_token` and sets the `refreshToken` cookie.
4. **Blogs** → captures `blog_id`, then `post_id` from the nested blog post.
5. **Posts** → captures `comment_id` from the post comment.
6. **Comments** → read/update the captured comment.
7. **Security** → `GET /security/devices` (captures `device_id`).
8. **Teardown** → `POST /auth/logout`.

**Optional** holds the self-registration flow, all destructive DELETEs, and logout-all — not
part of the walkthrough.

You can also run the whole collection with the **Collection Runner** (folders execute in order;
each request captures the IDs the next ones need).

## Auto-captured variables

| Variable                                    | Set by                                            |
| ------------------------------------------- | ------------------------------------------------- |
| `user_login`, `user_email`, `user_password` | `POST /users` prerequest (random, unique per run) |
| `user_id`                                   | `POST /users`                                     |
| `access_token`                              | `POST /auth/login`, `POST /auth/refresh-token`    |
| `blog_id`                                   | `POST /blogs`                                     |
| `post_id`                                   | `POST /blogs/:blogId/posts`, `POST /posts`        |
| `comment_id`                                | `POST /posts/:postId/comments`                    |
| `device_id`                                 | `GET /security/devices`                           |

## Auth types

- **Public** — no auth (`@PublicApi`).
- **Basic** — admin ops (blogs/posts/users create/update/delete). Uses `admin_username` /
  `admin_password`.
- **Bearer** — user ops (me, comments, user self-update). Uses `access_token`.
- **Refresh cookie** — refresh/logout/device requests rely on the `refreshToken` cookie.

## Caveats

- **Short token lifetimes.** The access token expires in **10 seconds** and the refresh token in
  **20 seconds**. Run requests promptly; re-run `POST /auth/login` or `POST /auth/refresh-token`
  if you get a `401`.
- **Secure refresh cookie over http.** `refreshToken` is set with `Secure` + `HttpOnly`.
  Postman's cookie jar carries it automatically, but browsers/agents may refuse to store a
  `Secure` cookie over plain `http://localhost`. If refresh/logout/device requests fail with
  `401`, that's the likely cause — test those over HTTPS, or temporarily relax the `secure` flag
  in the auth code for local testing.
- **`email` is validated as a URL** (`@IsUrl`), so registration/user bodies use values like
  `https://example.com/user123`.

## Validate

```bash
# JSON syntax + URL-string checks + route table.
# If the server is running, also cross-checks routes against /api-json.
node postman/validate.mjs

# Skip the Swagger cross-check (offline).
SKIP_SMOKE=1 node postman/validate.mjs
```

An optional shortcut is available as `yarn postman:validate`.
