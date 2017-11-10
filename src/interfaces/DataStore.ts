export interface DataStore {
    connectToDB(): Promise<{}>;
    login();
    register();
    getMyLearningObjects(userid);
    getLearningObject(learningObjectID: string);
    updateLearningObject(learningObject);
    deleteLearningObject(learningObject);
    createLearningObject(userid, learningObject);
    createLearningObjectFiles(learningObjectFiles);
}
