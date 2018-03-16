import * as jwt from 'express-jwt';

/**
 * Configuration for JWT middleware.
 *
 * @author Gustavus Shaw II
 */
export const enforceTokenAccess = jwt({
  secret: process.env.KEY,
  issuer: process.env.ISSUER,
  getToken: req => {
    return req.cookies.presence;
  }
}).unless({
  // Routes that don't require authorization
  path: [
    '/',
    '/users/ota-codes',
    '/users/validate-captcha',
    '/users/tokens',
    '/users/search',
    /\/users\/[A-Z,a-z,0-9,_]+\/tokens/i,
    /\/learning-object/i,
    { url: '/users', methods: ['POST'] },
    '/users/ota-codes',
    { url: '/users/tokens', methods: ['POST'] }
  ]
}); // register // all ota-code routes do their own verifcation outsides of JWT // login
// TODO: Whitelist user routes
