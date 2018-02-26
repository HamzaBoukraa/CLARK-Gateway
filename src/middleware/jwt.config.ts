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
  getToken: (req) => {
    console.log(req.cookies.presence);
    return req.cookies.presence;
  },
}).unless({
  // Routes that don't require authorization
  path: ['/api', '/api/users', '/api/users/tokens', /\/api\/users\/[A-Z,a-z,0-9,_]+\/tokens/i, /\/api\/learning-object/i],
});
// TODO: Whitelist user routes
