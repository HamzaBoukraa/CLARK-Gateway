import * as express from 'express';
import { Router } from 'express';
import * as multer from 'multer';
import * as proxy from 'express-http-proxy';
import { ExpressResponder } from '../drivers';
import { DataStore } from '../../interfaces/interfaces';
import { LearningObjectRepoFileInteractor } from '../../interactors/LearningObjectRepoFileInteractor';
import { sentry } from '../../logging/sentry';
import * as querystring from 'querystring';
import * as TokenManager from '../TokenManager';
import * as dotenv from 'dotenv';
import { LEARNING_OBJECT_ROUTES } from '../../environment/routes';
dotenv.config();
const USERS_API = process.env.USERS_API || 'localhost:4000';
const CART_API = process.env.CART_API || 'localhost:3006';
const LEARNING_OBJECT_SERVICE_URI =
  process.env.LEARNING_OBJECT_SERVICE_URI || 'localhost:5000';

/**
 * Serves as a factory for producing a router for the express app.rt
 *
 * @author Sean Donnelly
 */
export default class ExpressRouteDriver {
  upload = multer({ dest: 'tmp/' });

  /**
   * Produces a configured express router
   *
   * @param dataStore the data store that the routes should utilize
   */
  public static buildRouter(dataStore) {
    let e = new ExpressRouteDriver(dataStore);
    let router: Router = express.Router();
    e.setRoutes(router);
    return router;
  }

  private constructor(public dataStore: DataStore) {}

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
      res.json({ message: 'Welcome to the C.L.A.R.K. Gateway API' });
    });
    router.use('/users', this.buildUserRouter());
    router.use(
      '/users/:username/learning-objects',
      this.buildUserLearningObjectRouter()
    );
    router.use('/learning-objects', this.buildPublicLearningObjectRouter());

    router.get(
      '/count/:author',
      proxy(CART_API, {
        proxyReqPathResolver: req => {
          return `/count/${encodeURIComponent(req.params.author)}`;
        }
      })
    );
  }

  /**
   * Route handlers for /users
   *
   * @returns {Router}
   */
  private buildUserRouter() {
    let router: Router = express.Router();

    // Welcome page
    router
      .route('')
      .get(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            return '/users';
          }
        })
      )
      // Register
      .post(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            return '/users';
          }
        })
      )
      .patch(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            return '/users';
          }
        })
      );
    // Login
    router.post(
      '/tokens',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return '/users/tokens';
        }
      })
    );
    // Remove account
    router.route('/:username').delete(
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(req.params.username)}`;
        }
      })
    );

    router
      .route('/tokens')
      // Validate Token
      .get(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            return `/users/tokens`;
          }
        })
      );
    // Logout
    router.delete(
      '/:username/tokens',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(req.params.username)}/tokens`;
        }
      })
    );
    router.route('/ota-codes').all(
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          console.log(`/users/ota-codes?${querystring.stringify(req.query)}`);
          return `/users/ota-codes?${querystring.stringify(req.query)}`;
        }
      })
    );
    router
      .route('/:username/cart')
      .get(
        proxy(CART_API, {
          // get cart
          proxyReqPathResolver: req => {
            return req.query.download
              ? `/users/${encodeURIComponent(
                  req.params.username
                )}/cart?download=true`
              : `/users/${encodeURIComponent(req.params.username)}/cart`;
          }
        })
      )
      .delete(
        proxy(CART_API, {
          // clear cart
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(req.params.username)}/cart`;
          }
        })
      );
    router
      .route('/:username/cart/learning-objects/:author/:learningObjectName')
      .get(
        proxy(CART_API, {
          // download single object
          proxyReqPathResolver: req => {
            return `/api/users/${encodeURIComponent(
              req.params.username
            )}/cart/learning-objects/${req.params.author}/${encodeURIComponent(
              req.params.learningObjectName
            )}`;
          }
        })
      )
      .post(
        proxy(CART_API, {
          // add learning object to cart
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username
            )}/cart/learning-objects/${req.params.author}/${encodeURIComponent(
              req.params.learningObjectName
            )}`;
          }
        })
      )
      .delete(
        proxy(CART_API, {
          // remove learning object from cart
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username
            )}/cart/learning-objects/${req.params.author}/${encodeURIComponent(
              req.params.learningObjectName
            )}`;
          }
        })
      );
    router
      .route('/:username/library/learning-objects/:author/:learningObjectName')
      .post(
        proxy(CART_API, {
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username
            )}/library/learning-objects/${
              req.params.author
            }/${encodeURIComponent(req.params.learningObjectName)}`;
          }
        })
      );

    return router;
  }

  /**
   * Route handlers for /users/:username/learning-objects
   *
   * @returns {Router}
   */
  private buildUserLearningObjectRouter() {
    let router: Router = express.Router();
    router
      .route('')
      .get(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            return LEARNING_OBJECT_ROUTES.LOAD_LEARNING_OBJECT_SUMARY;
          }
        })
      )
      .post(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            return LEARNING_OBJECT_ROUTES.CREATE_UPDATE_LEARNING_OBJECT;
          }
        })
      );
    router
      .route('/:learningObjectName')
      .get(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            let learningObjectName = req.params.learningObjectName;
            return LEARNING_OBJECT_ROUTES.LOAD_LEARNING_OBJECT(
              null,
              learningObjectName
            );
          }
        })
      )
      .patch(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            return LEARNING_OBJECT_ROUTES.CREATE_UPDATE_LEARNING_OBJECT;
          }
        })
      )
      // FIXME: Deletion should delete files as well
      .delete(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            let learningObjectName = req.params.learningObjectName;
            return LEARNING_OBJECT_ROUTES.DELETE_LEARNING_OBJECT(
              learningObjectName
            );
          }
        })
      );
    // FIXME: Deletion should delete files as well
    router.delete(
      '/multiple/:names',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          let names = req.params.names.split(',');
          return LEARNING_OBJECT_ROUTES.DELETE_MULTIPLE_LEARNING_OBJECTS(names);
        }
      })
    );
    router.post(
      '/:learningObjectName/files',
      this.upload.any(),
      async (req, res) => {
        try {
          let responder = this.getResponder(res);
          let learningObjectFile = new LearningObjectRepoFileInteractor();
          let user = await TokenManager.decode(req.cookies.presence);
          await learningObjectFile.storeFiles(
            this.dataStore,
            responder,
            req.body.learningObjectID,
            req['files'],
            user.username
          );
        } catch (e) {
          sentry.logError(e);
        }
      }
    );
    router.delete('/:learningObjectID/files/:filename', async (req, res) => {
      try {
        let responder = this.getResponder(res);
        let learningObjectFile = new LearningObjectRepoFileInteractor();
        let user = await TokenManager.decode(req.cookies.presence);
        await learningObjectFile.deleteFile(
          this.dataStore,
          responder,
          req.params.learningObjectID,
          req.params.filename,
          user.username
        );
      } catch (e) {
        sentry.logError(e);
      }
    });
    return router;
  }

  /**
   * Route handlers for /learning-objects
   *
   * @private
   * @returns {Router}
   * @memberof ExpressRouteDriver
   */
  private buildPublicLearningObjectRouter() {
    let router: Router = express.Router();
    router.get(
      '',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          let route = `${
            LEARNING_OBJECT_ROUTES.FETCH_LEARNING_OBJECTS
          }?${querystring.stringify(req.query)}`;
          return route;
        }
      })
    );
    router.get(
      '/:author/:learningObjectName',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          let username = req.params.author;
          let learningObjectName = req.params.learningObjectName;
          return LEARNING_OBJECT_ROUTES.LOAD_LEARNING_OBJECT(
            username,
            learningObjectName
          );
        }
      })
    );
    router.get(
      '/:author',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.FETCH_USERS_LEARNING_OBJECTS(
            req.params.author
          );
        }
      })
    );
    return router;
  }
}

// /api/users/:username/learning-objects (require auth check for ownership or public viewing)
// /api/learning-objects

// POST /users/tokens          = login
// POST /users                 = register
// POST /users/:username/tokens      = validateToken
// DELETE /users/:username/tokens    = logout
// DELETE /users/:username           = remove account

// GET /users/:username/cart         = get user's cart
// DELETE /users/:username/cart      = clear user's cart
// DELETE /users/:username/cart/learning-objects/:author/:learningObjectName  = delete Learning Object from user's cart
// POST /users/:username/cart/learning-objects/:author/:learningObjectName  = add Learning Object to user's cart
