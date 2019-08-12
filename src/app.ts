import { ExpressDriver } from './drivers/drivers';
import { ServerlessCache } from './cache';
// ----------------------------------------------------------------------------------
// Initializations
// ----------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
ExpressDriver.start();

async function setCacheInterval() {
    setInterval(() => {
        ServerlessCache.fillCache();
    // tslint:disable-next-line: align
    }, 300000); // 5 minute interval
}

ServerlessCache.fillCache();
setCacheInterval();

