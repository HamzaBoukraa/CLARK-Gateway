import { LearningObject } from './../entities/LearningObject';
import { DataStore } from '../interfaces/DataStore';


export class MongoConnector implements DataStore {
  _db: Array<any>;
  _lo: any;

  _Cid: number;
  constructor () {
    this._db = [ ];
    this._Cid = 0;
  }

  updateLearningObject(learningObjectID: number, learningObject: any) {
    console.log(learningObjectID);
    const index: number = learningObjectID;
    for (let i = 0; i < this._db.length; i++) {
      if (this._db[i].id == index) {
        this._db[i].content = learningObject;
        this._db[i].name = learningObject.mName;
      }
    }
  }

  deleteLearningObject(learningObjectID: any) {
    const index: number = learningObjectID.substring(1, learningObjectID.length);
    for (let i = 0; i < this._db.length; i++) {
      if (this._db[i].id == index) {
        this._db.splice(i, 1);
      }
    }
  }
  createLearningObject(userid: any, learningObject: any) {
    this._lo = { };
    this._lo.id = this._Cid;
    this._lo.name = learningObject.mName;
    this._lo.content = learningObject;
    this._db.push(this._lo);
    this._Cid = this._Cid + 1;
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
    return this._db;
  }
}
