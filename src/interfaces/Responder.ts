export interface Responder {
  sendUser(user);
  sendOperationSuccess();
  sendOperationError(error?:{message: string, status: number}) : void;
  sendLearningObject(learningObject);
  sendLearningObjects(learningObjects);
  sendLearningObjectFiles(LearningObjectFiles);
  invalidLogin();
  invalidRegistration();
  invalidAccess();
}
