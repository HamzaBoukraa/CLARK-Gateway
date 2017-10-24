import { ExpressDriver, MongoConnector } from './drivers/drivers';
import { DataStore } from './interfaces/interfaces';

// ----------------------------------------------------------------------------------
// Initializations
// ----------------------------------------------------------------------------------

let dataStore: DataStore = new MongoConnector();

// ----------------------------------------------------------------------------------

ExpressDriver.start(dataStore);
