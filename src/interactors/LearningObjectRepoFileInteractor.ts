import { DataStore, Responder } from './../interfaces/interfaces';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { AWS_SDK_CONFIG } from '../config/aws-sdk/config';

export class LearningObjectRepoFileInteractor {
    private _s3;
    constructor() {
        //Init aws with keys to access S3;
        AWS.config.credentials = AWS_SDK_CONFIG.credentials;
        this._s3 = new AWS.S3({ region: AWS_SDK_CONFIG.region });
    }
    async storeFiles(dataStore: DataStore, responder: Responder, files, user) {
        this.uploadToS3(user.userid, files).then(
            (learningObjectFiles) => {
                responder.sendLearningObjectFiles(learningObjectFiles);
            }
        ).catch(
            (error) => {
                responder.sendOperationError({ message: "There was an error uploading your files. Please try again.", status: 400 });
            }
            );
    }
    /**
     * Uploads files to S3 bucket and returns array of LearningObjectFiles
     * 
     * @private
     * @param {any[]} files 
     * @returns {Promise<any[]>} 
     * @memberof LearningObjectRepoFileInteractor
     */
    private uploadToS3(author: string, files: any[]): Promise<any[]> {

        return Promise.all(files.map((file) => {
            return new Promise((resolve, reject) => {
                let tmp_path = file.path;
                // let tmp_file_name = file.filename;
                let originalname = file.originalname;
                let fileType = file.mimetype;
                let extension = originalname.match(/([A-Za-z]{1,})$/)[0];
                let date = Date.now().toString();

                let fs_file = fs.createReadStream(tmp_path);

                let params = {
                    Bucket: 'neutrino-file-uploads',
                    Key: `${author}/${originalname}`,
                    ACL: 'public-read',
                    Body: fs_file
                };
                this._s3.upload(params, (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        let newLearningObjectFile = {
                            name: originalname,
                            fileType: fileType,
                            extension: extension,
                            url: data.Location,
                            date: date,
                        }
                        resolve(newLearningObjectFile);
                    }
                });
            });
        }));

    }
}