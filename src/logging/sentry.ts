 import * as Raven from 'raven';
 import {SENTRY_URI} from './../config/config';
 /**
 * Singleton class for Sentry Error Logging
 *
 * @author Tyler Howard
 */
 class Sentry {
     constructor() {
        Raven.config(SENTRY_URI).install();
     }
     logError(error, status = null) {
        status ? error = 'Return Code: ' + status + ' (' + error + ')' : error = 'Message: ' + error;
        console.log('Error: ' + error);
        Raven.captureException(error);
     }
     logErrorWrapper(func) {
         Raven.context(function () {
            func();
         });
     }

 }
 export let sentry = new Sentry();
