import { AccessValidator } from './../interfaces/AccessValidator';
import * as express from 'express';
import * as multer from 'multer';
import { login, register } from '../interactors/AuthenticationInteractor';
import { create, destroy, read, readOne, update } from '../interactors/LearningObjectInteractor';
import { ExpressResponder } from '../drivers/ExpressResponder';
import { TokenManager } from './TokenManager';
import { DataStore } from '../interfaces/interfaces';
import { Router } from 'express';
import { LearningObjectRepoFileInteractor } from '../interactors/LearningObjectRepoFileInteractor';


/**
 * Serves as a factory for producing a router for the express app.
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

  private constructor(
    public accessValidator: AccessValidator,
    public dataStore: DataStore,
  ) { }

  getResponder(res) {
    // TODO: Should this be some sort of factory pattern?
    return new ExpressResponder(res);
  }

  setRoutes(router: Router) {
    router.get('/', function (req, res) {
      console.log('here')
      res.json({ message: 'Welcome to the Bloomin Onion API' });
    });
    router.post('/authenticate', async (req, res) => {
      try {
        let responder = this.getResponder(res);
        await login(this.dataStore, responder, req.body.username, req.body.password);
      } catch (e) {
        console.log(e);
      }
    });
    router.post('/register', async (req, res) => {
      try {
        let responder = this.getResponder(res);
        await register(this.dataStore, responder, req.body);
      } catch (e) {
        console.log(e);
      }
    });
    router.route('/learning-objects')
      .get(async (req, res) => {
        try {
          let responder = this.getResponder(res);
          let user = req['user'];
          await read(this.accessValidator, this.dataStore, responder, user);
        } catch (e) {
          console.log(e);
        }
      })
      .post(async (req, res) => {
        try {
          let responder = this.getResponder(res);
          let user = req['user'];
          await create(this.accessValidator, this.dataStore, responder, req.body, user);
        } catch (e) {
          console.log(e);
        }
      })
      .patch(async (req, res) => {
        try {
          let responder = this.getResponder(res);
          let user = req['user'];
          await update(this.accessValidator, this.dataStore, responder, req.body.id, req.body.learningObject, user);
        } catch (e) {
          console.log(e);
        }
      });
    router.route('/learning-objects:id')
      .get(async (req, res) => {
        try {
          let responder = this.getResponder(res);
          let user = req['user'];
          await readOne(this.accessValidator, this.dataStore, responder, req.params.id, user);
        } catch (e) {
          console.log(e);
        }
      })
      .delete(async (req, res) => {
        try {
          let responder = this.getResponder(res);
          let user = req['user'];
          await destroy(this.accessValidator, this.dataStore, responder, req.params.id, user);
        } catch (e) {
          console.log(e);
        }
      });
    router.post('/upload', this.upload.any(), async (req, res) => {
      try {
        let responder = this.getResponder(res);
        let learningObjectFile = new LearningObjectRepoFileInteractor();
        let user = req['user'];
        await learningObjectFile.storeFiles(this.dataStore, responder, req['files'], user);
      } catch (e) {
        console.log(e);
      }
    })
  }
}

