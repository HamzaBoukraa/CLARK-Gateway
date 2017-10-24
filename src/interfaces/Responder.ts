export interface Responder {
  sendUser(user);
  sendOperationSuccess();
  sendLearningObjects(learningObjects);
  invalidLogin();
  invalidRegistration();
  invalidAccess();
}
