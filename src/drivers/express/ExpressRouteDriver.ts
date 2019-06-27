import * as express from 'express';
import { Router } from 'express';
// tslint:disable-next-line:no-require-imports
import proxy = require('express-http-proxy');
import * as querystring from 'querystring';
import 'dotenv/config';
import {
  LEARNING_OBJECT_ROUTES,
  BUSINESS_CARD_ROUTES,
  FILE_UPLOAD_ROUTES,
  STATS_ROUTE,
  ADMIN_USER_ROUTES,
} from '../../routes';
import * as request from 'request';
import fetch from 'node-fetch';
import { SocketInteractor } from '../../interactors/SocketInteractor';

const USERS_API = process.env.USERS_API || 'localhost:4000';
const CART_API = process.env.CART_API || 'localhost:3006';
const RATING_API = process.env.RATING_API || 'localhost:3004';
const LEARNING_OBJECT_SERVICE_URI =
  process.env.LEARNING_OBJECT_SERVICE_URI || 'localhost:5000';
const FILE_UPLOAD_API = process.env.FILE_UPLOAD_API || 'localhost:5100';
const BUSINESS_CARD_API = process.env.BUSINESS_CARD_API || 'localhost:3009';

const APP_STATUS = process.env.APP_STATUS_URI;

/**
 * Serves as a factory for producing a router for the express app.rt
 *
 * @author Sean Donnelly
 */
export default class ExpressRouteDriver {
  /**
   * Produces a configured express router
   */
  public static buildRouter() {
    let e = new ExpressRouteDriver();
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
        message: 'Welcome to the C.L.A.R.K. Gateway API',
      });
    });

    // GET RATINGS FOR LEARNING OBJECT
    router.route('/learning-objects/:learningObjectId/ratings').get(
      proxy(RATING_API, {
        proxyReqPathResolver: req => {
          return `/learning-objects/${encodeURIComponent(
            req.params.learningObjectId,
          )}/ratings`;
        },
      }),
    );

    // GET RATING
    router.route('/ratings/:ratingId').get(
      proxy(RATING_API, {
        proxyReqPathResolver: req => {
          return `/ratings/${encodeURIComponent(req.params.ratingId)}`;
        },
      }),
    );
    // EDIT RATING
    router.route('/learning-objects/:learningObjectId/ratings/:ratingId').patch(
      proxy(RATING_API, {
        proxyReqPathResolver: req => {
          return `/learning-objects/${encodeURIComponent(
            req.params.learningObjectId,
          )}/ratings/${encodeURIComponent(req.params.ratingId)}`;
        },
      }),
    );
    // DELETE RATING
    router
      .route('/learning-objects/:learningObjectId/ratings/:ratingId')
      .delete(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/learning-objects/${encodeURIComponent(
              req.params.learningObjectId,
            )}/ratings/${encodeURIComponent(req.params.ratingId)}`;
          },
        }),
      );
    // CREATE RATING
    router.route('/learning-objects/:learningObjectId/ratings').post(
      proxy(RATING_API, {
        proxyReqPathResolver: req => {
          return `/learning-objects/${encodeURIComponent(
            req.params.learningObjectId,
          )}/ratings`;
        },
      }),
    );

    // FLAG A RATING
    router
      .route('/learning-objects/:learningObjectId/ratings/:ratingId/flags')
      .post(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/learning-objects/${encodeURIComponent(
              req.params.learningObjectId,
            )}/ratings/${encodeURIComponent(req.params.ratingId)}/flags`;
          },
        }),
      );

    // CREATE A RESPONSE
    router
      .route('/learning-objects/:learningObjectId/ratings/:ratingId/responses')
      .post(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/learning-objects/${encodeURIComponent(
              req.params.learningObjectId,
            )}/ratings/${encodeURIComponent(req.params.ratingId)}/responses`;
          },
        }),
      );

    // DELETE A RESPONSE
    router
      .route(
        '/learning-objects/:learningObjectId/ratings/:ratingId/responses/:responseId',
      )
      .delete(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/learning-objects/${encodeURIComponent(
              req.params.learningObjectId,
            )}/ratings/${encodeURIComponent(
              req.params.ratingId,
            )}/responses/${encodeURIComponent(req.params.responseId)}`;
          },
        }),
      );

    // EDIT A RESPONSE
    router
      .route(
        '/learning-objects/:learningObjectId/ratings/:ratingId/responses/:responseId',
      )
      .patch(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/learning-objects/${encodeURIComponent(
              req.params.learningObjectId,
            )}/ratings/${encodeURIComponent(
              req.params.ratingId,
            )}/responses/${encodeURIComponent(req.params.responseId)}`;
          },
        }),
      );

    router.get(
      '/library/stats',
      proxy(CART_API, {
        proxyReqPathResolver: req => {
          return `/library/stats`;
        },
      }),
    );

    router.use('/users', this.buildUserRouter());
    router.use(
      '/users/:username/learning-objects',
      this.buildUserLearningObjectRouter,
    );

    router.use('/learning-objects', this.buildPublicLearningObjectRouter());
    router.get(
      '/collections/stats',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return `/collections/stats`;
        },
      }),
    );
    router.get(
      '/collections/:name',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return `/collections/${encodeURIComponent(req.params.name)}`;
        },
      }),
    );
    router.get(
      '/collections/:name/meta',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return `/collections/${encodeURIComponent(req.params.name)}/meta`;
        },
      }),
    );
    router.get(
      '/collections/:name/learning-objects',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return `/collections/${encodeURIComponent(
            req.params.name,
          )}/learning-objects`;
        },
      }),
    );
    router.get(
      '/collections',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.GET_COLLECTIONS;
        },
      }),
    );
    router.get(
      '/users/identifiers/active',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/identifiers/active?${querystring.stringify(
            req.query,
          )}`;
        },
      }),
    );

    router.post(
      '/users/password',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/password`;
        },
      }),
    );

    router.patch(
      '/learning-objects/:learningObjectId/collections',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.ADD_LEARNING_OBJECT_TO_COLLECTION(
            req.params.learningObjectId,
          );
        },
      }),
    );

    router.get(
      '/users/update',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/update?${querystring.stringify(req.query)}`;
        },
      }),
    );

    router.get(
      '/collections/:collectionName/members',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return ADMIN_USER_ROUTES.FETCH_COLLECTION_MEMBERS(
            req.params.collectionName,
            req.query,
          );
        },
      }),
    );

    router.put(
      '/collections/:collectionName/members/:memberId',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return ADMIN_USER_ROUTES.ASSIGN_COLLECTION_MEMBERSHIP(
            req.params.collectionName,
            req.params.memberId,
          );
        },
      }),
    );

    router.patch(
      '/collections/:collectionName/members/:memberId',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return ADMIN_USER_ROUTES.EDIT_COLLECTION_MEMBERSHIP(
            req.params.collectionName,
            req.params.memberId,
          );
        },
      }),
    );

    router.delete(
      '/collections/:collectionName/members/:memberId',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return ADMIN_USER_ROUTES.REMOVE_COLLECTION_MEMBERSHIP(
            req.params.collectionName,
            req.params.memberId,
          );
        },
      }),
    );

    router.get(
      '/count/:author',
      proxy(CART_API, {
        proxyReqPathResolver: req => {
          return `/count/${encodeURIComponent(req.params.author)}`;
        },
      }),
    );

    router.get('/status', async (req, res) => {
      try {
        request(APP_STATUS, function(error, response, body) {
          res.send(body);
        });
      } catch (e) {
        res.status(500).send(`Problem checking status. Error: ${e}.`);
      }
    });

    router.get('/clientversion/:clientVersion', async (req, res) => {
      try {
        const response = await fetch(process.env.CLIENTVERSIONURL);
        const object = await response.json();
        const version: string = object.version;
        if (req.params.clientVersion === version) {
          res.sendStatus(200);
        } else {
          // Http 426 - Upgrade Required
          res
            .status(426)
            .send(
              'A new version of CLARK is available! . Refresh your page to see our latest changes.',
            );
        }
      } catch (e) {
        res.status(500).send('Could not recover the client version');
      }
    });

    router.post(
      '/learning-objects/:username/:learningObjectName/children',
      proxy(LEARNING_OBJECT_SERVICE_URI),
    );
    router.delete(
      '/learning-objects/:username/:learningObjectName/children',
      proxy(LEARNING_OBJECT_SERVICE_URI),
    );

    router.post(
      '/learning-objects/:learningObjectId/learning-outcomes',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return `/learning-objects/${encodeURIComponent(
            req.params.learningObjectId,
          )}/learning-outcomes`;
        },
      }),
    );

    router
      .route('/learning-objects/:learningObjectId/learning-outcomes/:outcomeId')
      .all(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            return `/learning-objects/${encodeURIComponent(
              req.params.learningObjectId,
            )}/learning-outcomes/${encodeURIComponent(req.params.outcomeId)}`;
          },
        }),
      );
  }

  /**
   * Route handlers for /users
   *
   * @returns {Router}
   */
  private buildUserRouter() {
    let router: Router = express.Router();

    router.post(
      '/:userId/learning-objects/:learningObjectId/changelog',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.CREATE_CHANGELOG(
            req.params.userId,
            req.params.learningObjectId,
          );
        },
      }),
    );
    router.get(
      '/:userId/learning-objects/:learningObjectId/changelog',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.GET_RECENT_CHANGELOG(
            req.params.userId,
            req.params.learningObjectId,
          );
        },
      }),
    );
    router.get(
      '/:userId/learning-objects/:learningObjectId/changelogs',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.GET_ALL_CHANGELOGS(
            req.params.userId,
            req.params.learningObjectId,
          );
        },
      }),
    );

    // Welcome page
    router
      .route('')
      .get(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            return '/users';
          },
        }),
      )
      // Register
      .post(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            return '/users';
          },
        }),
      )
      .patch(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            return '/users';
          },
        }),
      );
    router.get(
      '/stats',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return STATS_ROUTE.USER_STATS;
        },
      }),
    );
    // Login
    router.post(
      '/tokens',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return '/users/tokens';
        },
      }),
    );

    router.get(
      '/:id/tokens',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/${req.params.id}/tokens?${querystring.stringify(req.query)}`;
        },
      }),
    );

    router.route('/:username/profile').get(
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/${req.params.username}/profile`;
        },
      }),
    );

    // refresh token
    router.get(
      '/tokens/refresh',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return '/users/tokens/refresh';
        },
      }),
    );
    router.all(
      '/:userId/learning-objects/:learningObjectId/submissions',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.SUBMIT_FOR_REVIEW(
            req.params.userId,
            req.params.learningObjectId,
            req.query
          );
        },
      }),
    );
    // Remove account
    router.route('/:username').delete(
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(req.params.username)}`;
        },
      }),
    );

    // Get organizations for typeahead
    router.route('/organizations').get(
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/organizations?${querystring.stringify(req.query)}`;
        },
      }),
    );

    router
      .route('/tokens')
      // Validate Token
      .get(
        proxy(USERS_API, {
          proxyReqPathResolver: req => {
            return `/users/tokens`;
          },
        }),
      );
    // Logout
    router.delete(
      '/:username/tokens',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(req.params.username)}/tokens`;
        },
      }),
    );
    router.route('/ota-codes').all(
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/ota-codes?${querystring.stringify(req.query)}`;
        },
        // @ts-ignore
        userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
        try {
          let data = JSON.parse(proxyResData.toString('utf8'));
          if (data.username) {
            SocketInteractor.init().sendMessage(
              data.username,
              'VERIFIED_EMAIL',
            );
            userRes.redirect('http://clark.center');
            return '';
          } else {
            return proxyResData;
          }
        } catch (e) {
          return proxyResData;
        }
        },
      }),
    );
    router
      .route('/:username/cart')
      .get(
        proxy(CART_API, {
          // get cart
          proxyReqPathResolver: req => {
            return req.query.download
              ? `/users/${encodeURIComponent(
                  req.params.username,
                )}/cart?download=true`
              : `/users/${encodeURIComponent(req.params.username)}/cart`;
          },
        }),
      )
      .delete(
        proxy(CART_API, {
          // clear cart
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(req.params.username)}/cart`;
          },
        }),
      );
    router
      .route('/:username/cart/learning-objects/:author/:learningObjectName')
      .post(
        proxy(CART_API, {
          // add learning object to cart
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username,
            )}/cart/learning-objects/${encodeURIComponent(
              req.params.author,
              )}/${encodeURIComponent(
              req.params.learningObjectName,
            )}`;
          },
        }),
      )
      .delete(
        proxy(CART_API, {
          // remove learning object from cart
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username,
            )}/cart/learning-objects/${req.params.author}/${encodeURIComponent(
              req.params.learningObjectName,
            )}`;
          },
        }),
      );

    router
      .route('/:username/learning-objects/:learningObjectName/bundle')
      .get(
        proxy(CART_API, {
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username,
            )}/learning-objects/${encodeURIComponent(req.params.learningObjectName)}/bundle?${querystring.stringify(req.query)}`;
          },
        }),
      );

    router.get(
      '/search',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users?${querystring.stringify(req.query)}`;
        },
      }),
    );
    router.get(
      '/validate-captcha',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/validate-captcha?${querystring.stringify(req.query)}`;
        },
      }),
    );

    // BUSINESS CARDS
    router.get(
      '/:username/cards',
      proxy(BUSINESS_CARD_API, {
        proxyReqPathResolver: req => {
          const username = req.params.username;
          return BUSINESS_CARD_ROUTES.CARD(username, req.query);
        },
      }),
    );

    router.get(
      '/:username/notifications',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(
            req.params.username,
          )}/notifications`;
        },
      }),
    );
    router.get(
      '/:id/roles',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return ADMIN_USER_ROUTES.FETCH_USER_ROLES(req.params.id);
        },
      }),
    );

    return router;
  }

  /**
   * Route handlers for /users/:username/learning-objects
   *
   * @returns {Router}
   */
  private buildUserLearningObjectRouter(
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    let router: Router = express.Router({ mergeParams: true });
    const parentParams = _req.params;
    router
      .route('')
      .get(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            return (
              LEARNING_OBJECT_ROUTES.LOAD_LEARNING_OBJECT_SUMMARY(
                _req.params.username,
              ) +
              '?' +
              querystring.stringify(req.query)
            );
          },
        }),
      )
      .post(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            return LEARNING_OBJECT_ROUTES.CREATE_LEARNING_OBJECT;
          },
        }),
      );

    router.route('/:learningObjectName').delete(
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          let learningObjectName = req.params.learningObjectName;
          return LEARNING_OBJECT_ROUTES.DELETE_LEARNING_OBJECT(
            learningObjectName,
          );
        },
      }),
    );

    router.get(
      '/profile',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.LOAD_USER_PROFILE(
            encodeURIComponent(req.params.username),
          );
        },
      }),
    );

    router.patch(
      '/:learningObjectId',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.UPDATE_LEARNING_OBJECT(
            encodeURIComponent(req.params.learningObjectId),
          );
        },
      }),
    );
    router.patch(
      '/:learningObjectName/publish',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.PUBLISH_LEARNING_OBJECT;
        },
      }),
    );
    router.patch(
      '/:learningObjectName/unpublish',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.UNPUBLISH_LEARNING_OBJECT;
        },
      }),
    );
    router.delete(
      '/multiple/:names',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          let names = req.params.names.split(',');
          return LEARNING_OBJECT_ROUTES.DELETE_MULTIPLE_LEARNING_OBJECTS(names);
        },
      }),
    );
    // FILE OPERATIONS
    router
      .route('/:learningObjectID/files/:fileId')
      .patch(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            const id = req.params.learningObjectID;
            const fileId = req.params.fileId;
            return LEARNING_OBJECT_ROUTES.UPDATE_FILE(id, fileId);
          },
        }),
      )
      .delete(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            const id = req.params.learningObjectID;
            const fileId = req.params.fileId;
            return LEARNING_OBJECT_ROUTES.DELETE_FILE(id, fileId);
          },
        }),
      );
    router.patch(
      '/:id/pdf',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req =>
          LEARNING_OBJECT_ROUTES.UPDATE_PDF(req.params.id),
      }),
    );
    router.get(
      '/:id/files/:fileId/download',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = parentParams.username;
          return LEARNING_OBJECT_ROUTES.DOWNLOAD_FILE({
            username,
            id: req.params.id,
            fileId: req.params.fileId,
            query: req.query,
          });
        },
      }),
    );
    router.route('/:id/materials').get(
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = parentParams.username;
          const id = req.params.id;
          return LEARNING_OBJECT_ROUTES.GET_MATERIALS({
            username,
            id,
            query: req.query,
          });
        },
      }),
    );
    router.route('/:id/materials/files').post(
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = parentParams.username;
          const id = req.params.id;
          return LEARNING_OBJECT_ROUTES.ADD_MATERIALS(username, id);
        },
      }),
    );
    /**
     * FIXME: This route should be removed when the API is tested and  client is updated
     */
    router.route('/:objectId/files/:fileId/multipart').all(
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const username = parentParams.username;
          return FILE_UPLOAD_ROUTES.INIT_MULTIPART({
            username,
            objectId: req.params.objectId,
            fileId: req.params.fileId,
          });
        },
      }),
    );

    /**
     * FIXME: The admin suffix should be remove when API is tested and client is updated
     */
    router.route('/:objectId/files/:fileId/multipart/admin').post(
      proxy(FILE_UPLOAD_API, {
        proxyReqPathResolver: req => {
          const username = parentParams.username;
          return FILE_UPLOAD_ROUTES.INIT_MULTIPART({
            username,
            objectId: req.params.objectId,
            fileId: req.params.fileId,
          });
        },
      }),
    );
    router.route('/:objectId/files/:fileId/multipart/:uploadId/admin').patch(
      proxy(FILE_UPLOAD_API, {
        proxyReqPathResolver: req => {
          const username = parentParams.username;
          return FILE_UPLOAD_ROUTES.FINALIZE_MULTIPART({
            username,
            objectId: req.params.objectId,
            fileId: req.params.fileId,
            uploadId: req.params.uploadId,
          });
        },
      }),
    ).delete(
      proxy(FILE_UPLOAD_API, {
        proxyReqPathResolver: req => {
          const username = parentParams.username;
          return FILE_UPLOAD_ROUTES.ABORT_MULTIPART({
            username,
            objectId: req.params.objectId,
            fileId: req.params.fileId,
            uploadId: req.params.uploadId,
          });
        },
      }),
    );
    return router(_req, res, next);
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
        },
      }),
    );
    router.route('/:learningObjectId').get(
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return `/learning-objects/${encodeURIComponent(
            req.params.learningObjectId,
          )}`;
        },
      }),
    );
    router.get(
      '/stats',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return STATS_ROUTE.LEARNING_OBJECT_STATS;
        },
      }),
    );
    router.get(
      '/:author/:learningObjectName',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          let username = req.params.author;
          let learningObjectName = req.params.learningObjectName;
          return LEARNING_OBJECT_ROUTES.LOAD_LEARNING_OBJECT(
            username,
            learningObjectName,
          );
        },
      }),
    );
    router.get(
      '/:author',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.FETCH_USERS_LEARNING_OBJECTS(
            req.params.author,
          );
        },
      }),
    );
    router.get(
      '/:id/children/summary',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.GET_LEARNING_OBJECT_CHILDREN(
            req.params.id,
          );
        },
      }),
    );
    return router;
  }
}
