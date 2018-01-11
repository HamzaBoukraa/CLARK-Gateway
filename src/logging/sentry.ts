 import * as Raven from 'raven';
 import {SENTRY_URI} from './../config/config';
 class Sentry {
     constructor() {
        Raven.config(SENTRY_URI).install();
     }
     logError(e) {
        console.log(e);
        Raven.captureException(e);
     }
 }
 export let sentry = new Sentry();
