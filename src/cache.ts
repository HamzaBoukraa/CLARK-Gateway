import * as request from 'request';
import { reportError } from './shared/SentryConnector';
const APP_STATUS = process.env.APP_STATUS_URI;
import { EventEmitter } from 'events';

class Emitter extends EventEmitter {}

const emitter = new Emitter();

export class ServerlessCache {
     private static _cacheValue: object;

     static set cachedValue(val) {
        this._cacheValue = val;
     }
     static get cachedValue() {
         return this._cacheValue;
     }

    static fillCache() {
        request(APP_STATUS, function(error, response, body) {
            if (error) {
                reportError(error);
            } else {
                ServerlessCache.cachedValue = body;
            }
        });
    }
}
