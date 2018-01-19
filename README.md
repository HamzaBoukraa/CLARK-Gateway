[![CircleCI](https://circleci.com/gh/Cyber4All/learning-object-submission.svg?style=svg)](https://circleci.com/gh/Cyber4All/learning-object-submission)

# Learning Object Submission

This server-side application functions as a gateway for all learning object submission to the CLARK system.

## API Routes

### `/authenticate`
Request | []() | []()
---|---|---
`username`|`string`|user's unique name
`password`|`string`|user's password

Response | []() | []()
---|---|---
`firstname`|`string`|user's first name
`token`|`string`|user's JSON Web Token

### `/register`
Request | []() | []()
---|---|---
`username`|`string`|user's unique name
`password`|`string`|user's password
`firstname`|`string`|user's first name
`lastname`|`string`|user's last name
`email`|`string`|user's email address

Response | []() | []()
---|---|---
`firstname`|`string`|user's first name
`token`|`string`|user's JSON Web Token
