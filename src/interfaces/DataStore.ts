import { User } from "../entity/user";

export interface DataStore {
    register(user: { username: string, firstname: string, lastname: string, email: string, password: string }): Promise<User>;
    login(username: string, password: string): Promise<User>;
    createLearningObject(username: string, learningObject);
    getMyLearningObjects(username: string);
    getLearningObject(username: string, learningObjectID: string);
    updateLearningObject(username: string, learningObject);
    deleteLearningObject(learningObjectID: string);
}
