import { AccessValidator, AccessResponse } from './../interfaces/AccessValidator';
import * as jwt from 'jsonwebtoken';
import { key } from '../config/config';

export class TokenManager implements AccessValidator {
  authenticate(): AccessResponse {
    return {
      userid: 0,
      isAccessable: true,
    };
  }

}

/**
 * Takes a user object and generates a JWT for the user
 * @param user contains the userid, username, firstname, lastname, and email
 */
export function generateToken(userid) {
  /*let payload = {
      userid: user.userid
  };
  let options = {
      expiresIn: "2d",
      issuer: "bloomin_onion",
      audience: user.username
  };*/
  let token = jwt.sign({ userid: userid }, key);
  return token;
}

/**
 * Accepts a JWT and verifies that the token has been properly issued
 *
 * @param token the JWT as a string
 * @param callback the function to execute after verification
 */
export function verifyJWT(token, res, callback) {
  jwt.verify(token, key, { issuer: 'bloomin_onion' }, function (err, decoded) {
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
