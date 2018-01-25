import { User } from 'clark-entity';

export interface DataStore {
    register(user: { username: string, firstname: string, lastname: string, email: string, password: string }): Promise<User>;
    login(username: string, password: string): Promise<User>;
    createLearningObject(username: string, learningObject);
    getMyLearningObjects(username: string);
    getLearningObject(username: string, learningObjectName: string);
    updateLearningObject(username: string, learningObjectID: string, learningObject);
    deleteLearningObject(username: string, learningObjectName: string);
    deleteLearningObjects(username: string, learningObjectName: string[]);
    // CUBE
    readLearningObjects(): Promise<string[]>;
    readLearningObject(author: string, learningObjectName: string): Promise<string>;
    readMultipleLearningObjects(ids: string[], fullObject: boolean): Promise<string[]>;
}
