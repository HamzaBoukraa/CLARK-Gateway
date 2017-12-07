import { ExpressDriver, InMemoryConnector } from './drivers/drivers';
import { DataStore } from './interfaces/interfaces';

// ----------------------------------------------------------------------------------
// Initializations
// ----------------------------------------------------------------------------------

let dataStore: DataStore = new InMemoryConnector();

// ----------------------------------------------------------------------------------

ExpressDriver.start(dataStore);
