import { Responder } from '../../interfaces/interfaces';
import { Response } from 'express';
import { sentry } from '../../logging/sentry';


export class ExpressResponder implements Responder {

  constructor(public res: Response) {  }

  sendUser(user: any) {
    this.res.status(200).json(user);
  }
  sendLearningObject(learningObject) {
    this.res.status(200).json(learningObject);
  }
  sendLearningObjects(learningObjects) {
    this.res.status(200).json(learningObjects);
  }
  sendLearningObjectFiles(learningObjectFiles) {
    this.res.status(200).json(learningObjectFiles);
  }
  sendOperationSuccess() {
    this.res.sendStatus(200);
  }
  sendOperationError(message, status = 400) {
    sentry.logError(message, status);
    // Default message and status code if no custom error
    !message ? this.res.status(status).send('There was an error processing your request.') :
      // Custom error message and status code
      this.res.status(status).send(message);
  }
  invalidLogin() {
    this.res.status(400).json({ message: 'Invalid Username or Password' });
  }
  invalidRegistration() {
    this.res.status(400).send('Invalid registration credentials');
  }
  invalidAccess() {
    this.res.status(401).send('Invalid access token');
  }
  /**
   * Returns current Writable Response Stream
   *
   * @returns {Response}
   * @memberof Responder
   */
  writeStream(): Response {
    return this.res;
  }
}
