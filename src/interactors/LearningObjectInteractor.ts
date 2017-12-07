import { AccessValidator, DataStore, Responder } from './../interfaces/interfaces';

// FIXME: DRY violated by accessStatus repitition (promise structure maybe?)

export async function create(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, learningObject, user: any) {
  findAccessStatus(accessValidator, user)
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

export async function update(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, learningObject, user) {
  findAccessStatus(accessValidator, user)
    .then(userid => {
      // Patch data_as_json via dataStore call (else send error ->)
      // dataStore.updateLearningObject(learningObject.id, learningObject);
      responder.sendOperationSuccess();
    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

export async function destroy(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, learningObjectID, user) {
  findAccessStatus(accessValidator, user)
    .then(userid => {
      // Delete LO from data store (else send error ->)
      dataStore.deleteLearningObject(learningObjectID);
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
      responder.sendLearningObjects(
        dataStore.getMyLearningObjects(userid),
      );
    })
    .catch((error) => {
      responder.invalidAccess();
    });
}

export async function readOne(accessValidator: AccessValidator, dataStore: DataStore, responder: Responder, learningObjectID) {
  // responder.sendLearningObject(
  //   dataStore.getLearningObject(learningObjectID)
  // );
}

function findAccessStatus(accessValidator: AccessValidator, user) {
  return new Promise((resolve, reject) => {
    let accessStatus = accessValidator.authorize(user);
    if (accessStatus.isAccessable) {
      resolve(accessStatus.userid);
    } else reject(new Error('Invalid Access'));
  });
}
