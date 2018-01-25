import { Client, ConstructorOptions } from 'raven';
import { SENTRY_URI } from './../config/config';
import * as dotenv from 'dotenv';
//import * as fs from 'fs';
/**
 * Singleton class for Sentry Error Logging
 *
 * @author Tyler Howard
 */
dotenv.config();
// const envConfig = dotenv.parse(fs.readFileSync('.env'))
// for (var k in envConfig) {
//     process.env[k] = envConfig[k]
// }
class Sentry {
    config: ConstructorOptions = {};
    client: Client;
    constructor() {
        this.isProduction() ? this.configure() : this.client = new Client('', this.config);
    }
    isProduction(): boolean {
        console.log(process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'production') {
            return true;
        } else {
            return false;
        }
    }
    configure() {
        this.client = new Client(SENTRY_URI, this.config);
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
