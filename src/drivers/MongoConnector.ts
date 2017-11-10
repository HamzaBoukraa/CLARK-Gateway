import { DataStore } from '../interfaces/DataStore';

export class MongoConnector implements DataStore {

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
    return [{
      id: 0,
      name: 'An Example',
      content: {
        mName: 'An example',
        mClass: 'Course (15 weeks)',
        // tslint:disable-next-line:max-line-length
        goals: [{ 'text': 'Teach Secure Coding Practices' }, { 'text': 'sflj sdlakf sdlafjlj sadlfj dslafkjasdkljf af lsadjflsajf  asldjfksdjaf asldf sdlkfj asdlfkj aslfj aslfdj ladskfjl aldskjf alsdkfj alsjdf lasdfla s.' }],
      },
    }];
  }
  getLearningObject(learningObjectID){
    console.log('No Driver Implementation for getLearningObject');
    return {
      id: '0',
      author: null,
      name: 'An Example',
      date: Date.now().toString(),
      length: null,
      type: 'module',
      notes: 'My Notess',
      files: null,
    }
  }
  updateLearningObject(learningObject: any) {
    // throw new Error('Method not implemented.');
    console.log('No Driver Implementation for updateLearningObject');
  }
  deleteLearningObject(learningObject: any) {
    // throw new Error('Method not implemented.');
    console.log('No Driver Implementation for deleteLearningObject');
  }
  createLearningObject(userid: any, learningObject: any) {
    // throw new Error('Method not implemented.');
    console.log('No Driver Implementation for createLearningObject');
  }
  createLearningObjectFiles(learningObjectFiles: any) {
    //throw new Error("Method not implemented.");
    console.log("No Driver Implementation for storeLearningObjectFiles");
    return learningObjectFiles;
  }
}
