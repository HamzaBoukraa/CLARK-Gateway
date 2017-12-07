import { DataStore } from '../interfaces/DataStore';

export class MongoConnector implements DataStore {

  constructor() {
  }
  connectToDB(): Promise<{}> {
    throw new Error('Method not implemented.');
  }
  login() {
    return {
      userid: '0000',
      username: 'Test',
      firstname: 'T',
      lastname: 'Testo',
      email: 't@t.com',
      password: 'password',
      decoded_userpwd: 'password',
    };
  }
  register() {
    throw new Error('register not implemented.');
  }
  getMyLearningObjects(userid) {
    throw new Error('getMyLearningObjects not implemented.');
  }
  getLearningObject(learningObjectID) {
    throw new Error('getLearningObject not implemented.');
  }
  updateLearningObject(learningObject: any) {
    throw new Error('updateLearningObject not implemented.');
  }
  deleteLearningObject(learningObject: any) {
    throw new Error('deleteLearningObject not implemented.');
  }
  createLearningObject(userid: any, learningObject: any) {
    throw new Error('createLearningObject not implemented.');
  }
  createLearningObjectFiles(learningObjectFiles: any) {
    throw new Error("createLearningObjectFiles not implemented.");
  }
}
