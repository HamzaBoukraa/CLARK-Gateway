import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as http from 'http';
import { enforceTokenAccess } from '../middleware/jwt.config';
import { ExpressRouteDriver, ExpressAdminRouteDriver } from '../drivers';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as socketio from 'socket.io';
import { SocketInteractor } from '../../interactors/SocketInteractor';
import { config, errorHandler, requestHandler } from 'raven';
import * as dotenv from 'dotenv';

dotenv.config();

const KEEP_ALIVE_TIMEOUT = process.env.KEEP_ALIVE_TIMEOUT;

/**
 * Handles serving the API through the express framework.
 */
export class ExpressDriver {
  static app = express();
  static connectedClients = new Map<string, string>();

  static start() {
    if (process.env.NODE_ENV === 'production') {
      // Configure error handler - MUST BE THE FIRST ERROR HANDLER IN CALL ORDER
      config(process.env.SENTRY_URI).install();
      this.app.use(errorHandler());

      // Configure Sentry Route Handler - MUST BE FIRST ROUTE HANDLER
      this.app.use(requestHandler());

      // Configure Helmet Security
      // helmetConfig.setup(this.app);
    }

    // Configure app to log requests
    this.app.use(logger('dev'));

    // configure app to use bodyParser()
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(bodyParser.json({ limit: '50mb' }));

    // set cookie parser
    this.app.use(cookieParser());

    this.app.use(cors({ origin: true, credentials: true }));

    // Set Validation Middleware
    this.app.use(enforceTokenAccess);
    this.app.use(function(
      error: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) {
      if (error.name === 'UnauthorizedError') {
        res.status(401).send('Invalid Access Token');
      }
    });

    // Set our api routes
    this.app.use('/', ExpressRouteDriver.buildRouter());

    // Set Admin Middleware
    this.app.use('/admin', ExpressAdminRouteDriver.buildRouter());

    /**
     * Get port from environment and store in Express.
     */
    const port = process.env.PORT || '3000';
    this.app.set('port', port);

    /**
     * Create HTTP server.
     */
    const server = http.createServer(this.app);
    server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT
      ? parseInt(KEEP_ALIVE_TIMEOUT, 10)
      : server.keepAliveTimeout;

    let io = socketio(server, { pingInterval: 2000, pingTimeout: 5000 });
    let socketInteractor = SocketInteractor.init(io);

    io.on('connect', socket => {
      socketInteractor.connectUser(socket.request._query.user, socket.conn.id);

      socket.on('close', () => {
        socket.disconnect(true);
        socketInteractor.disconnectClient(socket.conn.id);
      });

      socket.on('disconnect', reason => {
        console.log('Unexpected disconnect! Reason: ', reason);
        socketInteractor.disconnectClient(socket.conn.id);
      });
    });

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port, () =>
      console.log(`CLARK Gateway API running on localhost:${port}`),
    );

    return this.app;
  }
}
