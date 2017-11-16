import { DataStore } from '../interfaces/DataStore';

import * as loki from 'lokijs';

export class MongoConnector implements DataStore {

  private db: loki = new loki('loki.json');
  private learningObjects: any;

  constructor(){
    this.learningObjects = this.db.addCollection('learningObjects');
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
    throw new Error('Method not implemented.');
  }
  getMyLearningObjects(userid) {
    return this.learningObjects.data;
  }
  getLearningObject(learningObjectID){
    return this.learningObjects.findOne({id: learningObjectID});
  }
  updateLearningObject(learningObject: any) {
    // throw new Error('Method not implemented.');
    this.learningObjects.update(learningObject);
    return learningObject;
  }
  deleteLearningObject(learningObject: any) {
   this.learningObjects.findAndRemove(learningObject);
  }
  createLearningObject(userid: any, learningObject: any) {
    learningObject['id'] = learningObject.date + learningObject.name.replace(/\s/g, '').toLowerCase();
    this.learningObjects.insert(learningObject)
    return learningObject;
  }
}
