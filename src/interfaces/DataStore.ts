import { LearningObject } from "@cyber4all/clark-entity";

export interface DataStore {
  createLearningObject(username: string, learningObject: LearningObject);
  getMyLearningObjects(username: string);
  getLearningObject(username: string, learningObjectName: string);
  updateLearningObject(
    username: string,
    learningObjectID: string,
    learningObject: LearningObject
  );
  deleteLearningObject(username: string, learningObjectName: string);
  deleteLearningObjects(username: string, learningObjectName: string[]);
  // CUBE
  readLearningObjects(query?: object): Promise<string[]>;
  readLearningObject(
    author: string,
    learningObjectName: string
  ): Promise<string>;
  readMultipleLearningObjects(
    ids: string[],
    fullObject: boolean
  ): Promise<string[]>;
}
