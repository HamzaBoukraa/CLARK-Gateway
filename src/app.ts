import { ExpressDriver, DBInteractionConnector, InMemoryConnector } from './drivers/drivers';
import { DataStore } from './interfaces/interfaces';

// ----------------------------------------------------------------------------------
// Initializations
// ----------------------------------------------------------------------------------

let dataStore: DataStore = new DBInteractionConnector();

// ----------------------------------------------------------------------------------

ExpressDriver.start(dataStore);
