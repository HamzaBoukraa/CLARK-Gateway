import 'dotenv/config';
import * as express from 'express';
import { Router } from 'express';
import * as proxy from 'express-http-proxy';
import * as querystring from 'querystring';
import {
  ADMIN_LEARNING_OBJECT_ROUTES,
  ADMIN_USER_ROUTES,
  ADMIN_MAILER_ROUTES,
  ADMIN_LAMBDA_ROUTES,
} from '../../routes';

const USERS_API = process.env.USERS_API || 'localhost:4000';
const LEARNING_OBJECT_SERVICE_URI =
  process.env.LEARNING_OBJECT_SERVICE_URI || 'localhost:5000';


/**
 * Lambda gateways
 *
 * Lambda introduces a new level of complexity since the base route
 * changes depending on the lambda function when seperate endpoints are introduced.
 * In the future it would be wise to group our lambda functions under one resource.
 */
const COA_API = process.env.COA_LAMBDA || 'localhost:4001';


/**
 * Serves as a factory for producing a router for the express app.rt
 *
 * @author Gustavus Shaw II
 */
export default class ExpressAdminRouteDriver {
  /**
   * Produces a configured express router
   */
  public static buildRouter() {
    let e = new ExpressAdminRouteDriver();
    let router: Router = express.Router();
    e.setRoutes(router);
    return router;
  }

  private constructor() {}

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

    // User Routes
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

    // Learning Object Routes
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
    router.patch(
      '/learning-objects',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const route = ADMIN_LEARNING_OBJECT_ROUTES.UPDATE_OBJECT();
          return route;
        },
      }),
    );
    router.get(
      '/learning-objects/:learningObjectId',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const route = ADMIN_LEARNING_OBJECT_ROUTES.GET_FULL_OBJECT(
            req.params.learningObjectId,
          );
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

    // Mailer Routes
    router.post(
      '/mail',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          const route = ADMIN_MAILER_ROUTES.SEND_BASIC_EMAIL;
          return route;
        },
      }),
    );
    router
      .route('/mail/templates')
      .get(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            const route = ADMIN_MAILER_ROUTES.GET_AVAILABLE_TEMPLATES;
            return route;
          },
        }),
      )
      .post(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            const route = ADMIN_MAILER_ROUTES.SEND_TEMPLATE_EMAIL;
            return route;
          },
        }),
      );


  // Lambda routes
    router.post(
      '/change-author',
      proxy(COA_API, {
      proxyReqPathResolver: req => {
        const route = ADMIN_LAMBDA_ROUTES.CHANGE_AUTHOR;
        return route;
      },
    }));
  }

}
