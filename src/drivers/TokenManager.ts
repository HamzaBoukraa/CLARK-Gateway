import { AccessValidator, AccessResponse } from './../interfaces/AccessValidator';
import * as jwt from 'jsonwebtoken';
import { key, issuer } from '../config/config';

export class TokenManager implements AccessValidator {
  authorize(user): AccessResponse {
    return {
      userid: user.id,
      isAccessable: true,
    };
  }
}

/**
 * Takes a user object and generates a JWT for the user
 * @param user contains the user's id, username, firstname, lastname, and email
 */
export function generateToken(user) {
  let payload = {
    id: user.id,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email
  };
  let options = {
    expiresIn: 3600,
    issuer: issuer,
    audience: user.username
  };
  let token = jwt.sign(payload, key, options);
  return token;
}

/**
 * Accepts a JWT and verifies that the token has been properly issued
 *
 * @param token the JWT as a string
 * @param callback the function to execute after verification
 */
export function verifyJWT(token, res, callback) {
  jwt.verify(token, key, { issuer: issuer }, function (err, decoded) {
    let status;
    if (err) {
      // invalid issuer
      status = false;
    } else {
      status = true;
    }
    if (typeof callback === 'function') {
      callback(status, jwt.decode(token));
    }
  });
}
