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
    router.post('/validateToken', (req, res) => {
      try {
        validateToken(this.getResponder(res), req.body.token);
      } catch (e) {
        sentry.logError(e);
      }
    });
    router.post('/authenticate', async (req, res) => {
      try {
        let responder = this.getResponder(res);
        await login(this.dataStore, responder, req.body.username, req.body.password);
      } catch (e) {
        sentry.logError(e);
      }
    });
    router.post('/register', async (req, res) => {
      try {
        let responder = this.getResponder(res);
        await register(this.dataStore, responder, req.body);
      } catch (e) {
        sentry.logError(e);
      }
    });
    router.route('/learning-objects')
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
    router.route('/learning-objects:id')
      .get(async (req, res) => {
        try {
          let responder = this.getResponder(res);
          let user = req['user'];
          await readOne(this.accessValidator, this.dataStore, responder, req.params.id, user);
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
    router.post('/files/upload', this.upload.any(), async (req, res) => {
      try {
        let responder = this.getResponder(res);
        let learningObjectFile = new LearningObjectRepoFileInteractor();
        let user = req['user'];
        await learningObjectFile.storeFiles(this.dataStore, responder, req.body.learningObjectID, req['files'], user);
      } catch (e) {
        sentry.logError(e);
      }
    });
    router.delete('/files/delete/:id/:filename', async (req, res) => {
      try {
        let responder = this.getResponder(res);
        let learningObjectFile = new LearningObjectRepoFileInteractor();
        let user = req['user'];
        await learningObjectFile.deleteFile(this.dataStore, responder, req.params.id, req.params.filename, user);
      } catch (e) {
        sentry.logError(e);
      }
    });
    router.get('/cube/learning-objects', async (req, res) => {
      await fetchLearningObjects(this.dataStore, this.getResponder(res));
    });
    router.get('/cube/learning-objects:id', async (req, res) => {
      await fetchLearningObject(this.dataStore, this.getResponder(res), req.params.id);
    });
    router.get('/cube/learning-objects/checkout/:ids', async (req, res) => {
      let ids = req.params.ids.split(',');
      let library = new LibraryInteractor();
      await library.checkout(this.dataStore, this.getResponder(res), ids);
    });
    router.get('/cube/learning-objects/multiple/:ids', async (req, res) => {
      let ids = req.params.ids.split(',');
      await fetchMultipleLearningObject(this.dataStore, this.getResponder(res), ids);
    });
  }
}

