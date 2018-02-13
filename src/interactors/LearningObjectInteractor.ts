import { DataStore, Responder } from './../interfaces/interfaces';

export async function create(dataStore: DataStore, responder: Responder, learningObject, user: any) {
  console.log(learningObject);
  // create new LearningObject(userid, data_as_json)
  dataStore.createLearningObject(user.username, learningObject)
    .then((learningObjectID) => {
      responder.sendLearningObject(learningObjectID);
    })
    .catch((error: string) => {
      console.log(error);
      if (error.match(/duplicate\s+key/g).length > 0) {
        responder.sendOperationError(`Please enter a unique name for this Learning Object.`, 400);
      } else
        responder.sendOperationError(`There was an error creating new Learning Object. ${error}`, 400);
    });
}

export async function update(dataStore: DataStore, responder: Responder, learningObjectID, learningObject, user) {

  // Patch data_as_json via dataStore call (else send error ->)
  dataStore.updateLearningObject(user.userid, learningObjectID, learningObject)
    .then(() => {
      responder.sendOperationSuccess();
    })
    .catch((error) => {
      console.log(error);
      if (error.match(/duplicate\s+key/g).length > 0) {
        responder.sendOperationError(`Please enter a unique name for this Learning Object.`, 400);
      } else
        responder.sendOperationError(`There was an error creating new learning object. ${error}`, 400);
    });
}

export async function destroy(dataStore: DataStore, responder: Responder, learningObjectName: string, user) {
  // Delete LO from data store (else send error ->)
  dataStore.deleteLearningObject(user.username, learningObjectName)
    .then(() => {
      // let learningObjectFile = new LearningObjectRepoFileInteractor();
      // learningObjectFile.deleteAllFiles(this.dataStore, responder, learningObjectName, user);
      console.log('success');
      responder.sendOperationSuccess();
    })
    .catch((error) => {
      responder.sendOperationError(`There was an error deleting learning object. ${error}`, 400);
    });
  // Send verification ->
}

export async function destroyMultiple(dataStore: DataStore, responder: Responder, learningObjectNames: string[], user) {
  // Delete LO from data store (else send error ->)
  dataStore.deleteLearningObjects(user.username, learningObjectNames)
    .then(() => {
      // let learningObjectFile = new LearningObjectRepoFileInteractor();
      // learningObjectFile.deleteAllFiles(this.dataStore, responder, learningObjectName, user);
      console.log('success');
      responder.sendOperationSuccess();
    })
    .catch((error) => {
      responder.sendOperationError(`There was an error deleting learning object. ${error}`, 400);
    });
  // Send verification ->
}

/**
 * Fetch all Learning Objects associated with the given user.
 *
 * @export
 * @param {AccessValidator} accessValidator
 * @param {DataStore} dataStore
 * @param {Responder} responder
 * @param {any} user
 */
export async function read(dataStore: DataStore, responder: Responder, user) {
  dataStore.getMyLearningObjects(user.username)
    .then((learningObjects) => {
      responder.sendLearningObjects(learningObjects);
    })
    .catch((error) => {
      responder.sendOperationError(`There was an error fetching user's learning objects. ${error}`, 400);
    });
}

export async function readOne(dataStore: DataStore, responder: Responder, learningObjectID, user) {
  // TODO: Once publish flag is in the database, add check (if you combine cube and onion readOne functionality)
  dataStore.getLearningObject(user.username, learningObjectID)
    .then((learningObject) => {
      // If published
      responder.sendLearningObject(learningObject);
      // else, ensure user has ownership
    })
    .catch((error) => {
      responder.sendOperationError(`There was an error fetching user's learning object. ${error}`, 400);
    });
}

// Cube Functions
export async function fetchLearningObjects(dataStore: DataStore, responder: Responder, query?: object) {
  let learningObjects = await dataStore.readLearningObjects(query);
  responder.sendLearningObjects(learningObjects);
}
export async function fetchLearningObject(dataStore: DataStore, responder: Responder, author: string, learningObjectName: string) {
  let learningObject = await dataStore.readLearningObject(author, learningObjectName);
  responder.sendLearningObjects(learningObject);
}
export async function fetchMultipleLearningObject(dataStore: DataStore, responder: Responder, ids: string[]) {
  let learningObjects = await dataStore.readMultipleLearningObjects(ids, false);
  responder.sendLearningObjects(learningObjects);
}
// END CUBE FUNCTIONS
