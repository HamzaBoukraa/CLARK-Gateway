import { Responder } from '../interfaces/interfaces';
import { Response } from 'express';

export class ExpressResponder implements Responder {

  constructor(public res: Response) { }

  sendUser(user: any) {
    this.res.status(200).json(user);
  }
  sendLearningObjects(learningObjects) {
    this.res.status(200).json(learningObjects);
  }
  sendOperationSuccess() {
    this.res.sendStatus(200);
  }
  invalidLogin() {
    this.res.status(400).json({ message: 'Invalid Username or Password' });
  }
  invalidRegistration() {
    this.res.status(400).send('Invalid registration credentials');
  }
  invalidAccess() {
    throw new Error('invalidAccess() not implemented!');
  }
}
