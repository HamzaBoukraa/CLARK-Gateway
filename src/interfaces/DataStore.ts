export interface DataStore {
    connectToDB(): Promise<{}>;
    login();
    register();
    getMyLearningObjects(userid);
    updateLearningObject(learningObject);
    deleteLearningObject(learningObject);
    createLearningObject(userid, learningObject);
    createLearningObjectTempFiles(learningObjectFiles: File[]): Promise<string>;
    getLearningObjectTempFiles(learningObjectFilesID: string);
    updateLearningObjectTempFiles(learningObjectFilesID: string, learningObjectFiles: File[]);
    deleteLearningObjectTempFiles(learningObjectFilesID: string);
    permStoreLearningObjectTempFiles(learningObjectFilesID: string);
}
