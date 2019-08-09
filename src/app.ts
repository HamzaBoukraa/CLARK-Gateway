import { ExpressDriver } from './drivers/drivers';
import { ServerlessCache } from './cache';
import * as request from 'request';
import { reportError } from './shared/SentryConnector';
const APP_STATUS = process.env.APP_STATUS_URI;
// ----------------------------------------------------------------------------------
// Initializations
// ----------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
ExpressDriver.start();

async function fillCache() {
    try {
        request(APP_STATUS, function(error, response, body) {
            ServerlessCache.cachedValue = body;
        });
    } catch (e) {
        reportError(e);
    }
}

async function setCacheInterval() {
    setInterval(() => {
        fillCache();
    // tslint:disable-next-line: align
    }, 300000); // 5 minute interval
}

fillCache();
setCacheInterval();

