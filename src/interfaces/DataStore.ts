export interface DataStore {
    connectToDB(): Promise<{}>;
    login();
    register();
    getMyLearningObjects(userid);
    updateLearningObject(learningObject);
    deleteLearningObject(learningObject);
    createLearningObject(userid, learningObject);
}
