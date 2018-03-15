import { Response } from 'express';

export interface Responder {
  sendUser(user);
  sendOperationSuccess();
  sendOperationError(message?: string, status?: number): void;
  sendLearningObject(learningObject);
  /**
   * Sends serialized LearningObject or array of serialized LearningObjects in response
   *
   * @param {(string | string[])} learningObjects
   * @memberof Responder
   */
  sendLearningObjects(learningObjects: string | string[]): void;
  sendLearningObjectFiles(LearningObjectFiles);
  invalidLogin();
  invalidRegistration();
  invalidAccess();

  /**
   * Returns current Writable Response Stream
   *
   * @returns {Response}
   * @memberof Responder
   */
  writeStream(): Response;
}
