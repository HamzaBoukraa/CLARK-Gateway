export interface DataStore {
    connectToDB(): Promise<{}>;
    login();
    register();
    getMyLearningObjects(userid);
    updateLearningObject(id, learningObject);
    deleteLearningObject(learningObject);
    createLearningObject(userid, learningObject);
}
