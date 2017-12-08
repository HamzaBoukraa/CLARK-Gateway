import { DataStore } from '../interfaces/DataStore';
import { User } from '../entity/entities';

export class MongoConnector implements DataStore {
  connectToDB(): Promise<{}> {
    throw new Error("Method not implemented.");
  }
  login(username: string, password: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  register(user: { username: string; firstname: string; lastname: string; email: string; password: string; }): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getMyLearningObjects(userid: string) {
    throw new Error("Method not implemented.");
  }
  getLearningObject(learningObjectID: string) {
    throw new Error("Method not implemented.");
  }
  updateLearningObject(learningObject: any) {
    throw new Error("Method not implemented.");
  }
  deleteLearningObject(learningObject: any) {
    throw new Error("Method not implemented.");
  }
  createLearningObject(userid: string, learningObject: any) {
    throw new Error("Method not implemented.");
  }

}
