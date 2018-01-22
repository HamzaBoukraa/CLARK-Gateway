import * as express from 'express';
import { Router } from 'express';
import * as multer from 'multer';
import { ExpressResponder, TokenManager } from '../drivers';
import { AccessValidator, DataStore } from '../../interfaces/interfaces';
import { login, register, validateToken } from '../../interactors/AuthenticationInteractor';
import { create, destroy, read, readOne, update, fetchLearningObjects,
         fetchLearningObject, fetchMultipleLearningObject } from '../../interactors/LearningObjectInteractor';
import { LearningObjectRepoFileInteractor } from '../../interactors/LearningObjectRepoFileInteractor';
import { sentry } from '../../logging/sentry';
import { LibraryInteractor } from '../../interactors/LibraryInteractor';

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
    let accessValidator = new TokenManager();
    let e = new ExpressRouteDriver(accessValidator, dataStore);
    let router: Router = express.Router();
    e.setRoutes(router);
    return router;
  }

  private constructor(public accessValidator: AccessValidator, public dataStore: DataStore) {}

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
    router.get('/', function (req, res) {
      res.json({ message: 'Welcome to the Bloomin Onion API' });
    });
    router.use('/users', this.buildUserRouter());
    router.use('/users/:username/learning-objects', this.buildUserLearningObjectRouter());

    router.get('/cube/learning-objects:id', async (req, res) => {
      await fetchLearningObject(this.dataStore, this.getResponder(res), req.params.id);
    });
  }

  /**
   * Route handlers for /api/users
   *
   * @returns {Router}
   */
  buildUserRouter() {
    let router: Router = express.Router();

    // Register FIXME: /register
    router.post('', async (req, res) => {
      try {
        let responder = this.getResponder(res);
        await register(this.dataStore, responder, req.body);
      } catch (e) {
        sentry.logError(e);
      }
    });
    // Login FIXME: /authenticate
    router.post('/tokens', async (req, res) => {
      try {
        let responder = this.getResponder(res);
        await login(this.dataStore, responder, req.body.username, req.body.password);
      } catch (e) {
        sentry.logError(e);
      }
    });
    // Remove account
    router.delete('/:username', async (req, res) => {
      sentry.logError(new Error('Cannot delete user accounts at this time'));
    });
    router.route('/:username/tokens')
      // Validate Token FIXME: /validateToken
      .post(async (req, res) => {
        try {
          validateToken(this.getResponder(res), req.body.token);
        } catch (e) {
          sentry.logError(e);
        }
      })
      .delete(async (req, res) => {
        // Logout
      });
    router.route('/:username/cart')
      .get(async (req, res) => {
        // Get user's cart FIXME: maybe /cart/multiple/:ids ?
        await fetchMultipleLearningObject(this.dataStore, this.getResponder(res), ids);
      })
      .delete(async (req, res) => {
        // Clear user's cart
      });
    router.route('/:username/cart/learning-objects/:hash')
      .post(async (req, res) => {
        // Add LO to cart
      })
      .delete(async (req, res) => {
        // Delete LO from cart
      });
    router.get('/:username/cart?download=true', async (req, res) => {
      // FIXME: Get ids from cart storage, then send to library checkout
      let ids = req.params.ids.split(',');
      let library = new LibraryInteractor();
      await library.checkout(this.dataStore, this.getResponder(res), ids);
    });

    return router;
  }

  /**
   * Route handlers for /api/users/:username/learning-objects
   *
   * @returns {Router}
   */
  private buildUserLearningObjectRouter() {
    let router: Router = express.Router();
    router.route('')
    .get(async (req, res) => {
      try {
        let responder = this.getResponder(res);
        let user = req['user'];
        await read(this.accessValidator, this.dataStore, responder, user);
      } catch (e) {
        sentry.logError(e);
      }
    })
    .post(async (req, res) => {
      try {
        let responder = this.getResponder(res);
        let user = req['user'];
        await create(this.accessValidator, this.dataStore, responder, req.body, user);
      } catch (e) {
        sentry.logError(e);
      }
    })
    .patch(async (req, res) => {
      try {
        let responder = this.getResponder(res);
        let user = req['user'];
        await update(this.accessValidator, this.dataStore, responder, req.body.id, req.body.learningObject, user);
      } catch (e) {
        sentry.logError(e);
      }
    });
    router.route('/:id')
      .get(async (req, res) => {
        try {
          let responder = this.getResponder(res);
          let user = req['user'];
          await readOne(this.dataStore, responder, req.params.id, user);
        } catch (e) {
          sentry.logError(e);
        }
      })
      .delete(async (req, res) => {
        try {
          let responder = this.getResponder(res);
          let user = req['user'];
          await destroy(this.accessValidator, this.dataStore, responder, req.params.id, user);
        } catch (e) {
          sentry.logError(e);
        }
      });
    router.post('/:id/files', this.upload.any(), async (req, res) => {
      try {
        let responder = this.getResponder(res);
        let learningObjectFile = new LearningObjectRepoFileInteractor();
        let user = req['user'];
        await learningObjectFile.storeFiles(this.dataStore, responder, req.body.learningObjectID, req['files'], user);
      } catch (e) {
        sentry.logError(e);
      }
    });
    router.delete('/:id/files/:filename', async (req, res) => {
      try {
        let responder = this.getResponder(res);
        let learningObjectFile = new LearningObjectRepoFileInteractor();
        let user = req['user'];
        await learningObjectFile.deleteFile(this.dataStore, responder, req.params.id, req.params.filename, user);
      } catch (e) {
        sentry.logError(e);
      }
    });
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
// DELETE /users/:username/cart/learning-objects/:hash  = delete Learning Object from user's cart
// POST /users/:username/cart/learning-objects/:hash  = add Learning Object to user's cart
