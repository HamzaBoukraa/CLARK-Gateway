import * as jwt from 'express-jwt';
import { key, issuer } from '../config/config';

/**
 * Configuration for JWT middleware.
 *
 * @author Gustavus Shaw II
 */
export const enforceTokenAccess = jwt({
  secret: key,
  issuer: issuer,
  getToken: req => {
    return req.cookies.presence;
  }
}).unless({
  // Routes that don't require authorization
  path: [
    '/api',
    '/api/users/ota-codes',
    '/api/users/tokens',
    /\/api\/users\/[A-Z,a-z,0-9,_]+\/tokens/i,
    /\/api\/learning-object/i,
    { url: '/api/users', methods: ['POST'] }, // register
    '/api/users/ota-codes', // all ota-code routes do their own verifcation outsides of JWT
    { url: '/api/users/tokens', methods: ['POST'] } // login
  ]
});
// TODO: Whitelist user routes
