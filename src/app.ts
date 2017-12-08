import { ExpressDriver, DatabaseInteractionConnector } from './drivers/drivers';
import { DataStore } from './interfaces/interfaces';

// ----------------------------------------------------------------------------------
// Initializations
// ----------------------------------------------------------------------------------

let dataStore: DataStore = new DatabaseInteractionConnector();

// ----------------------------------------------------------------------------------

ExpressDriver.start(dataStore);
