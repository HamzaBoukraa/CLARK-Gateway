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
  USER_ROUTES,
  UTILITY_ROUTES,
} from '../../routes';
import { SocketInteractor } from '../../interactors/SocketInteractor';

const USERS_API = process.env.USERS_API || 'localhost:4000';
const CART_API = process.env.CART_API || 'localhost:3006';
const RATING_API = process.env.RATING_API || 'localhost:3004';
const LEARNING_OBJECT_SERVICE_URI =
  process.env.LEARNING_OBJECT_SERVICE_URI || 'localhost:5000';
const FILE_UPLOAD_API = process.env.FILE_UPLOAD_API || 'localhost:5100';
const BUSINESS_CARD_API = process.env.BUSINESS_CARD_API || 'localhost:3009';
const UTILITY_API = process.env.UTILITY_URI || 'localhost:9000';

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

  private constructor() { }

  /**
   * Defines the active routes for the API. Routes take an async callback function that contains a request and response object.
   * The callback awaits a particular interactor function that executes the connected business use case.
   *
   * @param router the router being used by the webserver
   */
  setRoutes(router: Router) {
    router.get('/', function (req, res) {
      res.json({
        message: 'Welcome to the C.L.A.R.K. Gateway API',
      });
    });

    // GET RATINGS FOR LEARNING OBJECT
    router.route('/users/:username/learning-objects/:CUID/version/:version/ratings').get(
      proxy(RATING_API, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(
            req.params.username,
          )}/learning-objects/${encodeURIComponent(
            req.params.CUID,
          )}/version/${encodeURIComponent(
            req.params.version,
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
    router.route('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID').patch(
      proxy(RATING_API, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(
            req.params.username,
          )}/learning-objects/${encodeURIComponent(
            req.params.CUID,
          )}/version/${encodeURIComponent(
            req.params.version,
          )}/ratings/${encodeURIComponent(
            req.params.ratingID,
          )}`;
        },
      }),
    );
    // DELETE RATING
    router
      .route('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID')
      .delete(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username,
            )}/learning-objects/${encodeURIComponent(
              req.params.CUID,
            )}/version/${encodeURIComponent(
              req.params.version,
            )}/ratings/${encodeURIComponent(
              req.params.ratingID,
            )}`;
          },
        }),
      );
    // CREATE RATING
    router.route('/users/:username/learning-objects/:CUID/version/:version/ratings').post(
      proxy(RATING_API, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(
            req.params.username,
          )}/learning-objects/${encodeURIComponent(
            req.params.CUID,
          )}/version/${encodeURIComponent(
            req.params.version,
          )}/ratings`;
        },
      }),
    );

    // FLAG A RATING
    router
      .route('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/flags')
      .post(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username,
            )}/learning-objects/${encodeURIComponent(
              req.params.CUID,
            )}/version/${encodeURIComponent(
              req.params.version,
            )}/ratings/${encodeURIComponent(
              req.params.ratingID,
            )}/flags`;
          },
        }),
      );

    // CREATE A RESPONSE
    router
      .route('/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/responses')
      .post(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username,
            )}/learning-objects/${encodeURIComponent(
              req.params.CUID,
            )}/version/${encodeURIComponent(
              req.params.version,
            )}/ratings/${encodeURIComponent(
              req.params.ratingID,
            )}/responses`;
          },
        }),
      );

    // DELETE A RESPONSE
    router
      .route(
        '/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/responses/:responseID',
      )
      .delete(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username,
            )}/learning-objects/${encodeURIComponent(
              req.params.CUID,
            )}/version/${encodeURIComponent(
              req.params.version,
            )}/ratings/${encodeURIComponent(
              req.params.ratingID,
            )}/responses/${encodeURIComponent(
              req.params.responseID,
            )}`;
          },
        }),
      );

    // EDIT A RESPONSE
    router
      .route(
        '/users/:username/learning-objects/:CUID/version/:version/ratings/:ratingID/responses/:responseID',
      )
      .patch(
        proxy(RATING_API, {
          proxyReqPathResolver: req => {
            return `/users/${encodeURIComponent(
              req.params.username,
            )}/learning-objects/${encodeURIComponent(
              req.params.CUID,
            )}/version/${encodeURIComponent(
              req.params.version,
            )}/ratings/${encodeURIComponent(
              req.params.ratingID,
            )}/responses/${encodeURIComponent(
              req.params.responseID,
            )}`;
          },
        }),
      );

    router.get(
      '/learning-objects/metrics',
      proxy(CART_API, {
        proxyReqPathResolver: req => {
          return `/learning-objects/metrics`;
        },
      }),
    );

    router.route('/users/:username/learning-objects/:id')
      .all(proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          let uri = `/users/${encodeURIComponent(req.params.username)}/learning-objects/${encodeURIComponent(req.params.id)}`;
          if (req.query) {
            uri += '?' + querystring.stringify(req.query);
          }
          return uri;
        },
      }));

    // Retrieves the metrics for a learning object
    router.get(
      '/users/:username/learning-objects/:cuid/metrics',
      proxy(CART_API, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(req.params.username)}/learning-objects/${encodeURIComponent(req.params.cuid)}/metrics`;
        },
      }),
    );

    // Retrieves the materials for a learning object
    router.get(
      '/users/:username/learning-objects/:id/materials',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return `/users/:username/learning-objects/${encodeURIComponent(req.params.id)}/materials?${querystring.stringify(
            req.query,
          )}`;
        },
      }),
    );

    router.get(
      '/users/:username/learning-objects/:id/children',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return `/users/:username/learning-objects/${encodeURIComponent(req.params.id)}/children`;
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
    // get the status for the banner
    router.get(
      '/status',
      proxy(UTILITY_API, {
        proxyReqPathResolver: req => {
          return UTILITY_ROUTES.STATUS;
        },
      }),
    );
    // get the maintenace status for maintenance page
    router.get(
      `/maintenance`,
      proxy(UTILITY_API, {
        proxyReqPathResolver: req => {
          return UTILITY_ROUTES.MAINTENANCE;
        },
      }),
    );
    // get the client version to see if there is an update
    router.get(
      '/clientversion/:clientVersion',
      proxy(UTILITY_API, {
        proxyReqPathResolver: req => {
          return `/clientversion/${encodeURIComponent(req.params.clientVersion)}`;
        },
      }),
    );

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
      '/:userId/learning-objects/:cuid/changelog',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.CREATE_CHANGELOG(
            req.params.userId,
            req.params.cuid,
          );
        },
      }),
    );
    router.get(
      '/:userId/learning-objects/:cuid/changelogs',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.GET_ALL_CHANGELOGS(
            req.params.userId,
            req.params.cuid,
            req.query,
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
          return `/users/${req.params.id}/tokens?${querystring.stringify(
            req.query,
          )}`;
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
            req.query,
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
        userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
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
    router.get(
      '/:username/library/learning-objects',
      proxy(CART_API, {
        // get library
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(req.params.username)}/library/learning-objects`;
        },
      }),
    );
    router.delete(
      '/:username/library/learning-objects/:cuid',
      proxy(CART_API, {
        // Delete a learning object from the users library
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(req.params.username)}/library/learning-objects/${encodeURIComponent(req.params.cuid)}`;
        },
      }),
    );
    router.post(
      '/:username/library/learning-objects',
      proxy(CART_API, {
        // Add a learning object to the users library
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(req.params.username)}/library/learning-objects`;
        },
      }),
    );

    router.post('/:username/learning-objects/:cuid/versions', proxy(LEARNING_OBJECT_SERVICE_URI, {
      proxyReqPathResolver: req => {
        return `/users/${encodeURIComponent(
          req.params.username,
        )}/learning-objects/${encodeURIComponent(
          req.params.cuid,
        )}/versions`;
      },
    }));

    router.route('/:username/learning-objects/:cuid/versions/:version/bundle').get(
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return `/users/${encodeURIComponent(
            req.params.username,
          )}/learning-objects/${encodeURIComponent(
            req.params.cuid,
          )}/versions/${encodeURIComponent(
            req.params.version,
          )}/bundle`;
        },
      }),
    );

    router.get('/:username/learning-objects/:learningObjectId/outcomes', proxy(LEARNING_OBJECT_SERVICE_URI, {
      proxyReqPathResolver: req => {
        return `/users/${encodeURIComponent(
          req.params.username,
        )}/learning-objects/${encodeURIComponent(
          req.params.learningObjectId,
        )}/outcomes`;
      },
    }));

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

    router.get(
      '/:username',
      proxy(USERS_API, {
        proxyReqPathResolver: req => {
          return USER_ROUTES.FETCH_USER(req.params.username);
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
            const authorUsername = parentParams.username;
            return LEARNING_OBJECT_ROUTES.CREATE_LEARNING_OBJECT(
              authorUsername,
            );
          },
        }),
      );

    router.delete(
      '/:learningObjectName',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          const learningObjectName = req.params.learningObjectName;
          return LEARNING_OBJECT_ROUTES.DELETE_LEARNING_OBJECT_BY_NAME(
            learningObjectName,
          );
        },
      }),
    );

    router
      .route('/:learningObjectId')
      .patch(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            const authorUsername = parentParams.username;
            const learningObjectId = req.params.learningObjectId;
            return LEARNING_OBJECT_ROUTES.UPDATE_LEARNING_OBJECT({
              authorUsername,
              id: learningObjectId,
            });
          },
        }),
      )
      .delete(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            const authorUsername = parentParams.username;
            const learningObjectId = req.params.learningObjectId;
            return LEARNING_OBJECT_ROUTES.DELETE_LEARNING_OBJECT({
              authorUsername,
              id: learningObjectId,
            });
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

    router.post(
      '/:learningObjectId/revisions',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.CREATE_LEARNING_OBJECT_REVISION(
            req.params.username,
            req.params.learningObjectId,
          );
        },
      }),
    );

    router.get(
      '/:learningObjectId/revisions/:revisionId',
      proxy(LEARNING_OBJECT_SERVICE_URI, {
        proxyReqPathResolver: req => {
          return LEARNING_OBJECT_ROUTES.GET_LEARNING_OBJECT_REVISION({
            username: req.params.username,
            learningObjectId: req.params.learningObjectId,
            revisionId: req.params.revisionId,
            query: req.query,
          });
        },
      }),
    );
    // FILE OPERATIONS
    /**
     * TODO: Deprecate in favor of more RESTful `/:learningObjectId/materials/files/:fileId` when clients have updated
     */
    router
      .route('/:learningObjectID/files/:fileId')
      .patch(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            const username = parentParams.username;
            const learningObjectId = req.params.learningObjectID;
            const fileId = req.params.fileId;
            return LEARNING_OBJECT_ROUTES.UPDATE_FILE({
              username,
              learningObjectId,
              fileId,
            });
          },
        }),
      )
      .delete(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            const username = parentParams.username;
            const learningObjectId = req.params.learningObjectID;
            const fileId = req.params.fileId;
            return LEARNING_OBJECT_ROUTES.UPDATE_FILE({
              username,
              learningObjectId,
              fileId,
            });
          },
        }),
      );
    router
      .route('/:learningObjectId/materials/files/:fileId')
      .patch(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            const username = parentParams.username;
            const learningObjectId = req.params.learningObjectId;
            const fileId = req.params.fileId;
            return LEARNING_OBJECT_ROUTES.UPDATE_FILE({
              username,
              learningObjectId,
              fileId,
            });
          },
        }),
      )
      .delete(
        proxy(LEARNING_OBJECT_SERVICE_URI, {
          proxyReqPathResolver: req => {
            const username = parentParams.username;
            const learningObjectId = req.params.learningObjectId;
            const fileId = req.params.fileId;
            return LEARNING_OBJECT_ROUTES.UPDATE_FILE({
              username,
              learningObjectId,
              fileId,
            });
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
    router
      .route('/:objectId/files/:fileId/multipart/:uploadId/admin')
      .patch(
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
      )
      .delete(
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
