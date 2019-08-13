import { ExpressDriver } from './drivers/drivers';
import { ServerlessCache } from './cache';
const environment = process.env.NODE_ENV;
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
if (environment !== 'development') {
    ServerlessCache.fillCache();
    setCacheInterval();
}


