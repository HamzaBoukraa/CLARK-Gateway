import { AccessValidator, DataStore, Responder } from './../interfaces/interfaces';
import * as AWS from 'aws-sdk';

export class LearningObjectRepoFileInteractor {
    private _aws;
    constructor() {
        //Init aws with keys to access S3;
        //this._aws = AWS.config.loadFromPath('');
    }
    async tempStoreFiles(dataStore: DataStore, responder: Responder, learningObjectFiles: File[]) {
        dataStore.createLearningObjectTempFiles(learningObjectFiles).then(
            (learningObjectFilesID) => {
                responder.sendLearningObjectFiles(
                    dataStore.getLearningObjectTempFiles(learningObjectFilesID)
                );
            }).catch(
            (error) => {
                responder.sendOperationError();
            }
            );
    }
    async read(dataStore: DataStore, responder: Responder, learningObjectFilesID: string) {
        responder.sendLearningObjectFiles(
            dataStore.getLearningObjectTempFiles(learningObjectFilesID)
        );
    }
    async update(dataStore: DataStore, responder: Responder, learningObjectFilesID: string, learningObjectFiles: File[]){
        responder.sendLearningObjectFiles(
            dataStore.updateLearningObjectTempFiles(learningObjectFilesID, learningObjectFiles)
        );
    }
    async storeFiles(dataStore: DataStore, responder: Responder, learningObjectFilesID: string){
        // TODO
        // Grab Files from temp storage; Upload to S3 bucket; Update files with S3 url; Add files to LearningObject;
        // Delete temp files;
    }
    async delete(dataStore: DataStore, responder: Responder, learningObjectFilesID: string){
        dataStore.deleteLearningObjectTempFiles(learningObjectFilesID);
        responder.sendOperationSuccess();
    }
}