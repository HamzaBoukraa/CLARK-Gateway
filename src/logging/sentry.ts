 import * as Raven from 'raven';
 import { Client} from 'raven';
 import {SENTRY_URI} from './../config/config';
 /**
 * Singleton class for Sentry Error Logging
 *
 * @author Tyler Howard
 */
 class Sentry {
     client: Client = new Client(SENTRY_URI);
     constructor() {
         this.client.install();
     }
     logError(error, status?) {
        status ? error = 'Return Code: ' + status + ' (' + error + ')' : error = 'Message: ' + error;
        console.log('Error: ' + error);
        this.client.captureException(error);
     }
     logErrorWrapper(func) {
         this.client.context(function () {
            func();
         });
     }

 }
 export let sentry = new Sentry();