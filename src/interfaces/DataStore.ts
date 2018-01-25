import { User } from "@cyber4all/clark-entity";

export interface DataStore {
    register(user: { username: string, firstname: string, lastname: string, email: string, password: string }): Promise<User>;
    login(username: string, password: string): Promise<User>;
    createLearningObject(username: string, learningObject);
    getMyLearningObjects(username: string);
    getLearningObject(username: string, learningObjectID: string);
    updateLearningObject(username: string, learningObjectID: string, learningObject);
    deleteLearningObject(learningObjectID: string);
}
