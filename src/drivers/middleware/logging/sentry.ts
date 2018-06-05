import { Client, ConstructorOptions } from 'raven';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Singleton class for Sentry Error Logging
 *
 * @author Tyler Howard
 */
class Sentry {
    config: ConstructorOptions = {};
    client: Client;
    constructor() {
        this.isProduction() ? this.configure() : this.client = new Client('', this.config);
    }
    isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }
    configure() {
        this.client = new Client(process.env.SENTRY_URI, this.config);
        this.client.install();
    }
    logError(error, status?) {
        status ? error = 'Return Code: ' + status + ' (' + error + ')' : error = 'Message: ' + error;
        console.log(`Error at ${Date.now()}`, error);
        this.client.captureException(error);
    }
    logErrorWrapper(func) {
        this.client.context(function () {
            func();
        });
    }
}
export const sentry = new Sentry();
