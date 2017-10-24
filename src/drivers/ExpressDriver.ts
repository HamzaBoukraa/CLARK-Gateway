import { DataStore } from './../interfaces/DataStore';

import { ExpressRouteDriver } from './drivers';
import * as express from 'express';
import * as path from 'path';
import * as helmetConfig from '../middleware/helmet';
import * as bodyParser from 'body-parser';


import { router as log } from '../routes/log';
import { enforceTokenAccess as jwtValidator } from '../middleware/jwt.config';
import * as http from 'http';

/**
 * Handles serving the API through the express framework.
 */
export class ExpressDriver {
  static app = express();

  static start(dataStore: DataStore) {
    // Configure Helmet Security
    helmetConfig.setup(this.app);

    // configure app to use bodyParser()
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    // set header to allow connection by given url
    this.app.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.header('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.header('Access-Control-Allow-Credentials', 'true');

      // Pass to next layer of middleware
      next();
    });



    // Set our api routes
    this.app.use('/api', ExpressRouteDriver.buildRouter(dataStore), log);

    this.linkClient();
    /**
     * Get port from environment and store in Express.
     */
    const port = process.env.PORT || '3000';
    this.app.set('port', port);

    /**
     * Create HTTP server.
     */
    const server = http.createServer(this.app);

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port, () => console.log(`API running on localhost:${port}`));


    return this.app;
  }

  static linkClient() {
    // Point static path to dist
    this.app.use(express.static(path.join(__dirname, '../client')));

    // Catch all other routes and return the index file
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });
  }
}
