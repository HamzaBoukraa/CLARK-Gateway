import { AccessValidator, DataStore, Responder } from './../interfaces/interfaces';
import { LearningObjectRepoFileInteractor } from './LearningObjectRepoFileInteractor';

// FIXME: DRY violated by accessStatus repitition (promise structure maybe?)

export async function create(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, learningObject, user: any) {
  findAccessStatus(accessValidator, user)
    .then(userid => {
      // create new LearningObject(userid, data_as_json)
      dataStore.createLearningObject(userid, learningObject)
        .then((learningObjectID) => {
          responder.sendLearningObject(learningObjectID);
        })
        .catch((error: string) => {
          if (error.match(/duplicate\s+key/g).length > 0) {
            responder.sendOperationError(`Please enter a unique name for this Learning Object.`, 400);
          } else
            responder.sendOperationError(`There was an error creating new Learning Object. ${error}`, 400);
        });
    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

export async function update(accessValidator: AccessValidator,
                             dataStore: DataStore, responder: Responder,
                             learningObjectID, learningObject, user) {
  findAccessStatus(accessValidator, user)
    .then(userid => {
      // Patch data_as_json via dataStore call (else send error ->)
      dataStore.updateLearningObject(userid, learningObjectID, learningObject)
        .then(() => {
          responder.sendOperationSuccess();
        })
        .catch((error) => {
          if (error.match(/duplicate\s+key/g).length > 0) {
            responder.sendOperationError(`Please enter a unique name for this Learning Object.`, 400);
          } else
            responder.sendOperationError(`There was an error creating new learning object. ${error}`, 400);
        });
    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

export async function destroy(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, learningObjectID, user) {
  findAccessStatus(accessValidator, user)
    .then(userid => {
      // Delete LO from data store (else send error ->)
      dataStore.deleteLearningObject(learningObjectID)
        .then(() => {
          let learningObjectFile = new LearningObjectRepoFileInteractor();
          learningObjectFile.deleteAllFiles(this.dataStore, responder, learningObjectID, user);
        })
        .catch((error) => {
          responder.sendOperationError(`There was an error deleting learning object. ${error}`, 400);
        });
      // Send verification ->
    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

export async function read(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, user) {
  findAccessStatus(accessValidator, user)
    .then(userid => {
      // Fetch all Learning Objects associated with the userid
      dataStore.getMyLearningObjects(userid)
        .then((learningObjects) => {
          responder.sendLearningObjects(
            learningObjects
          );
        })
        .catch((error) => {
          responder.sendOperationError(`There was an error fetching user's learning objects. ${error}`, 400);
        });

    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

export async function readOne(dataStore: DataStore, responder: Responder, learningObjectID, user) {
  // TODO: Once publish flag is in the database, add check (if you combine cube and onion readOne functionality)
  dataStore.getLearningObject(learningObjectID)
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
export async function fetchLearningObjects(dataStore: DataStore, responder: Responder, filters?: object) {
  console.log(filters);
  let learningObjects = await dataStore.readLearningObjects();
  responder.sendLearningObjects(learningObjects);
}
export async function fetchLearningObject(dataStore: DataStore, responder: Responder, id: string) {
  let learningObject = await dataStore.readLearningObject(id);
  responder.sendLearningObjects(learningObject);
}
export async function fetchMultipleLearningObject(dataStore: DataStore, responder: Responder, ids: string[]) {
  let learningObjects = await dataStore.readMultipleLearningObjects(ids, false);
  responder.sendLearningObjects(learningObjects);
}
// END CUBE FUNCTIONS

function findAccessStatus(accessValidator: AccessValidator, user): Promise<string> {
  return new Promise((resolve, reject) => {
    let accessStatus = accessValidator.authorize(user);
    if (accessStatus.isAccessable) {
      resolve(accessStatus.userid);
    } else reject(new Error('Invalid Access'));
  });
}
