import { User } from "../entity/user";

export interface DataStore {
    connectToDB(): Promise<{}>;
    login(username: string, password: string): Promise<User>;
    register(user: { username: string, firstname: string, lastname: string, email: string, password: string }): Promise<User>;
    getMyLearningObjects(userid: string);
    getLearningObject(learningObjectID: string);
    updateLearningObject(learningObject);
    deleteLearningObject(learningObject);
    createLearningObject(userid: string, learningObject);
}
