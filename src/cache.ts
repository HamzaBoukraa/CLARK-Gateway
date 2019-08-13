import * as request from 'request';
import { reportError } from './shared/SentryConnector';
const APP_STATUS = process.env.APP_STATUS_URI;
export class ServerlessCache {
     private static _cacheValue: object;

     static set cachedValue(val) {
        this._cacheValue = val;
     }
     static get cachedValue() {
         return this._cacheValue;
     }

    static fillCache() {
        try {
            request(APP_STATUS, function(error, response, body) {
                ServerlessCache.cachedValue = body;
            });
        } catch (e) {
            reportError(e);
        }
    }
}
