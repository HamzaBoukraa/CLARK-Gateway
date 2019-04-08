import { Response } from 'express';

export interface Responder {
  sendUser(user: any): any;
  sendOperationSuccess(): any;
  sendOperationError(message?: string, status?: number): void;
  sendLearningObject(learningObject: any): any;
  /**
   * Sends serialized LearningObject or array of serialized LearningObjects in response
   *
   * @param {(string | string[])} learningObjects
   * @memberof Responder
   */
  sendLearningObjects(learningObjects: string | string[]): void;
  sendLearningObjectFiles(LearningObjectFiles: any): any;
  invalidLogin(): any;
  invalidRegistration(): any;
  invalidAccess(): any;

  /**
   * Returns current Writable Response Stream
   *
   * @returns {Response}
   * @memberof Responder
   */
  writeStream(): Response;
}
