import { DataStore, Responder } from './../interfaces/interfaces';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

export class LearningObjectRepoFileInteractor {
    private _s3;
    constructor() {
        //Init aws with keys to access S3;
        AWS.config.credentials = {
            "accessKeyId": "KEYKEYKEY",
            "secretAccessKey": "KEYKEYKEY",
        };
        this._s3 = new AWS.S3({ region: 'us-east-2' })
    }
    async storeFiles(dataStore: DataStore, responder: Responder, files) {
        this.uploadToS3(files).then(
            (learningObjectFiles) => {
                responder.sendLearningObjectFiles(learningObjectFiles);
            }
        ).catch(
            (error) => {
                responder.sendOperationError({ message: "There was an error uploading your files. Please try again.", status: 400 });
            }
            );
    }

    private uploadToS3(files: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            var learningObjectFiles = [];
            files.forEach(file => {
                var tmp_path = file.path;
                var tmp_file_name = file.filename;

                var name = file.originalname;
                var fileType = file.mimetype;
                var date = Date.now().toString();

                var fs_file = fs.createReadStream(tmp_path);

                var params = {
                    Bucket: 'neutrino-file-uploads',
                    Key: `${tmp_file_name}`,
                    ACL: 'public-read',
                    Body: fs_file
                };

                this._s3.putObject(params, (error, data) => {
                    if (error) {
                        reject(null);
                    } else {
                        var params = {
                            Bucket: 'neutrino-file-uploads',
                            Key: `${tmp_file_name}`,
                        };

                        var url = this._s3.getSignedUrl('getObject', params);

                        var newLearningObjectFile = {
                            name: name,
                            fileType: fileType,
                            url: url,
                            date: date,
                        };

                        learningObjectFiles.push(newLearningObjectFile);
                        if (learningObjectFiles.length === files.length) {
                            resolve(learningObjectFiles);
                        }
                    }
                });
            });
        });
    }
}