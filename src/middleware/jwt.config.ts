import * as jwt from 'express-jwt';
import { key } from '../config/config';

export function enforceTokenAccess() {
  return jwt({
      secret: key,
    }).unless({
      path: ['/', '/api', '/api/authenticate', '/api/register'],
    });
}
