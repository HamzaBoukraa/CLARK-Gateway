import * as jwt from 'express-jwt';
import * as dotenv from 'dotenv';
dotenv.config();
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
  },
}).unless({
  // Routes that don't require authorization
  path: [
    '/',
    { url: /\/users\/[0-z,.,-]+/i, methods: ['GET'] },
    /\/clientversion\/[0-z,.,-]/,
    '/users/ota-codes',
    '/users/validate-captcha',
    '/users/identifiers/active',
    '/users/organizations',
    '/users/verifyorganization',
    '/users/tokens',
    '/users/search',
    /\/users\/[0-z,.,-]+\/tokens/i,
    /\/learning-object/i,
    { url: '/users', methods: ['POST'] },
    '/users/ota-codes',
    { url: '/users/tokens', methods: ['POST'] },
    /\/collections\/.+\/learning-objects/i,
    /\/collections\/.+\/meta/i,
    '/status',
    '/maintenance',
    '/collections',
    '/outages',
    /\/users\/[0-z,.,-]+\/cards/i,
    '/library/stats',
  ],
}); // register // all ota-code routes do their own verification outsides of JWT // login
// TODO: Whitelist user routes
