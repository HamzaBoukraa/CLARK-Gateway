import { AccessValidator, DataStore, Responder } from './../interfaces/interfaces';

// FIXME: DRY violated by accessStatus repitition (promise structure maybe?)

export async function create(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, learningObject) {
  findAccessStatus(accessValidator)
    .then(userid => {
      // create new LearningObject(userid, data_as_json)
      dataStore.createLearningObject(userid, learningObject);
      // if success,
      // else send failure  ->
      responder.sendOperationSuccess();
    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

export async function update(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, learningObjectID, learningObject) {
  findAccessStatus(accessValidator)
    .then(userid => {
      // Patch data_as_json via dataStore call (else send error ->)
      dataStore.updateLearningObject(learningObjectID, learningObject);
      responder.sendOperationSuccess();
    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

export async function destroy(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, learningObjectID) {
  findAccessStatus(accessValidator)
    .then(userid => {
      // Delete LO from data store (else send error ->)
      dataStore.deleteLearningObject(learningObjectID);
      // Send verification ->
    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

export async function read(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder) {
  findAccessStatus(accessValidator)
    .then(userid => {
      // Fetch all Learning Objects associated with the userid
      responder.sendLearningObjects(
        dataStore.getMyLearningObjects(userid),
      );
    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

function findAccessStatus(accessValidator: AccessValidator) {
  return new Promise((resolve, reject) => {
    let accessStatus = accessValidator.authenticate();
    if (accessStatus.isAccessable) {
      resolve(accessStatus.userid);
    } else reject(new Error('Invalid Access'));
  });
}
