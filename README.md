[![CircleCI](https://circleci.com/gh/Cyber4All/CLARK-Gateway.svg?style=svg)](https://circleci.com/gh/Cyber4All/learning-object-submission)

# Learning Object Submission

This server-side application functions as a gateway for all learning object submission to the CLARK system.

Full developer documentation can be found at https://cyber4all.github.io/CLARK-Gateway/

## API Routes

### `POST /users` - Add a new user
Request | []() | []()
---|---|---
`username`|`string`|user's unique name
`password`|`string`|user's password
`firstname`|`string`|user's first name
`lastname`|`string`|user's last name
`email`|`string`|user's email address

#### On Success
Response | []() | []()
---|---|---
`token` | `string` | user's access token
`email` | `string` | user's email address
`name` | `string` | user's first and last name (concatenated)
`objects` | [LearningObject[]](https://github.com/Cyber4All/clark-entity#LearningObject) | user's learning objects
`username` | `string` | user's unique username

#### On Error
status | body | statusText
---|---|---
`400` | `{ message: 'Invalid username or password' }` | `Bad Request`

### `POST /api/users/token` - Create a new token for a user (log in)
Request | []() | []()
---|---|---
`username`|`string`|user's unique name
`password`|`string`|user's password

#### On Success
Response | []() | []()
---|---|---
`token` | `string` | user's access token
`email` | `string` | user's email address
`name` | `string` | user's first and last name (concatenated)
`objects` | [LearningObject[]](https://github.com/Cyber4All/clark-entity#LearningObject) | user's learning objects
`username` | `string` | user's unique username

#### On Error
status | body | statusText
---|---|---
`400` | `'Invalid username or password'` | `Bad Request`
