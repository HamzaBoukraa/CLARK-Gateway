import * as express from 'express';
import { Router } from 'express';
import * as proxy from 'express-http-proxy';
import { ExpressResponder } from '../drivers';
import * as querystring from 'querystring';
import * as dotenv from 'dotenv';
import {
  ADMIN_LEARNING_OBJECT_ROUTES,
  ADMIN_USER_ROUTES,
  ADMIN_MAILER_ROUTES,
} from '../../routes';

dotenv.config();
const USERS_API = process.env.USERS_API || 'localhost:4000';
const LEARNING_OBJECT_SERVICE_URI =
  process.env.LEARNING_OBJECT_SERVICE_URI || 'localhost:5000';

/**
 * Serves as a factory for producing a router for the express app.rt
 *
 * @author Gustavus Shaw II
 */
export default class ExpressAdminRouteDriver {
  /**
   * Produces a configured express router
   *
   * @param dataStore the data store that the routes should utilize
   */
  public static buildRouter() {
    let e = new ExpressAdminRouteDriver();
    let router: Router = express.Router();
    e.setRoutes(router);
    return router;
  }

  private constructor() {}

  getResponder(res) {
    // TODO: Should this be some sort of factory pattern?
    return new ExpressResponder(res);
  }

  /**
   * Defines the active routes for the API. Routes take an async callback function that contains a request and response object.
   * The callback awaits a particular interactor function that executes the connected business use case.
   *
   * @param router the router being used by the webserver
   */
  setRoutes(router: Router) {
    router.get('/', function(req, res) {
      res.json({
        message: 'Welcome to the Admin C.L.A.R.K. Gateway API',
      });
    });

    router.get(
      '/learning-objects',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const route = `${
            ADMIN_LEARNING_OBJECT_ROUTES.FETCH_LEARNING_OBJECTS
          }?${querystring.stringify(req.query)}`;
          return route;
        },
      }),
    );
    router.get(
      '/users',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          const route = ADMIN_USER_ROUTES.FETCH_USERS_WITH_FILTER(req.query);
          return route;
        },
      }),
    );
    router.delete(
      '/users/:id',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          const route = ADMIN_USER_ROUTES.DELETE_USER(req.params.id);
          return route;
        },
      }),
    );
    router.patch(
      '/users/:username/learning-objects/:learningObjectName/publish',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = req.params.username;
          const learningObjectName = req.params.learningObjectName;
          return ADMIN_LEARNING_OBJECT_ROUTES.PUBLISH_LEARNING_OBJECT(
            username,
            learningObjectName,
          );
        },
      }),
    );
    router.patch(
      '/users/:username/learning-objects/:learningObjectName/unpublish',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = req.params.username;
          const learningObjectName = req.params.learningObjectName;
          return ADMIN_LEARNING_OBJECT_ROUTES.UNPUBLISH_LEARNING_OBJECT(
            username,
            learningObjectName,
          );
        },
      }),
    );
    router.patch(
      '/users/:username/learning-objects/:learningObjectName/lock',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = req.params.username;
          const learningObjectName = req.params.learningObjectName;
          return ADMIN_LEARNING_OBJECT_ROUTES.LOCK_LEARNING_OBJECT(
            username,
            learningObjectName,
          );
        },
      }),
    );
    router.patch(
      '/users/:username/learning-objects/:learningObjectName/unlock',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = req.params.username;
          const learningObjectName = req.params.learningObjectName;
          return ADMIN_LEARNING_OBJECT_ROUTES.UNLOCK_LEARNING_OBJECT(
            username,
            learningObjectName,
          );
        },
      }),
    );
    router.delete(
      '/users/:username/learning-objects/:learningObjectName',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = req.params.username;
          const learningObjectName = req.params.learningObjectName;
          return ADMIN_LEARNING_OBJECT_ROUTES.DELETE_LEARNING_OBJECT(
            username,
            learningObjectName,
          );
        },
      }),
    );
    router.delete(
      '/users/:username/learning-objects/multiple/:learningObjectIDs',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = req.params.username;
          const learningObjectIDs = req.params.learningObjectIDs;
          return ADMIN_LEARNING_OBJECT_ROUTES.DELETE_MULTIPLE_LEARNING_OBJECTS(
            username,
            learningObjectIDs,
          );
        },
      }),
    );
    router.post(
      '/mail',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          const route = ADMIN_MAILER_ROUTES.SEND_BASIC_EMAIL;
          return route;
        },
      }),
    );
  }
}
