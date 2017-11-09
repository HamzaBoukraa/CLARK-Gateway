export interface Responder {
  sendUser(user);
  sendOperationSuccess();
  sendOperationError(error?:{message: string, status: number}) : void;
  sendLearningObjects(learningObjects);
  sendLearningObjectFiles(learningObjectFiles: {id: string, files: File[]}): void;
  invalidLogin();
  invalidRegistration();
  invalidAccess();
}
