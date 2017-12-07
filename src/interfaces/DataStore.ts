export interface DataStore {
    connectToDB(): Promise<{}>;
    login(username: string, password: string);
    register(newUser);
    getMyLearningObjects(userid);
    getLearningObject(learningObjectID: string);
    updateLearningObject(learningObject);
    deleteLearningObject(learningObject);
    createLearningObject(userid, learningObject);
    createLearningObjectFiles(learningObjectFiles);
}
