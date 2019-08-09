export class ServerlessCache {
     private static _cacheValue: object;

     static set cachedValue(val) {
        this._cacheValue = val;
     }
     static get cachedValue() {
         return this._cacheValue;
     }
}
