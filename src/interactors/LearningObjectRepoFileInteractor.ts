import { DataStore, Responder } from './../interfaces/interfaces';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { AWS_SDK_CONFIG } from '../config/aws-sdk/config';

// TODO: Move to microservice
export class LearningObjectRepoFileInteractor {
  private _s3;
  constructor() {
    // Init aws with keys to access S3;
    AWS.config.credentials = AWS_SDK_CONFIG.credentials;
    this._s3 = new AWS.S3({ region: AWS_SDK_CONFIG.region });
  }

  /**
   * Performs uploadToS3 operation and sends response
   *
   * @param {DataStore} dataStore
   * @param {Responder} responder
   * @param {string} learningObjectID
   * @param {any} files
   * @param {User} user
   * @memberof LearningObjectRepoFileInteractor
   */
  async storeFiles(
    dataStore: DataStore,
    responder: Responder,
    learningObjectID: string,
    files,
    username: string
  ) {
    this.uploadToS3(username, learningObjectID, files)
      .then(learningObjectFiles => {
        responder.sendLearningObjectFiles(learningObjectFiles);
      })
      .catch(error => {
        responder.sendOperationError(
          'There was an error uploading your files. Please try again.',
          400
        );
      });
  }

  /**
   * Performs deleteFromS3 operation and sends response
   *
   * @param {DataStore} dataStore
   * @param {Responder} responder
   * @param {string} learningObjectID
   * @param {string} filename
   * @param {User} user
   * @memberof LearningObjectRepoFileInteractor
   */
  async deleteFile(
    dataStore: DataStore,
    responder: Responder,
    learningObjectID: string,
    filename: string,
    username: string
  ) {
    this.deleteFromS3(username, learningObjectID, filename)
      .then(success => {
        responder.sendOperationSuccess();
      })
      .catch(error => {
        responder.sendOperationError(
          'There was an error deleting your file. Please try again.',
          400
        );
      });
  }

  async deleteAllFiles(
    dataStore: DataStore,
    responder: Responder,
    learningObjectID: string,
    username: string
  ) {
    this.deleteFromS3(username, learningObjectID, null, true)
      .then(success => {
        responder.sendOperationSuccess();
      })
      .catch(error => {
        responder.sendOperationError(
          'There was an error deleting your files. Please try again.',
          400
        );
      });
  }

  /**
   * Uploads files to S3 bucket and returns array of LearningObjectFiles
   *
   * @private
   * @param {any[]} files
   * @returns {Promise<any[]>}
   * @memberof LearningObjectRepoFileInteractor
   */
  private uploadToS3(
    username: string,
    learningObjectID: string,
    files: any[]
  ): Promise<any[]> {
    return Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          let name_desc = file.originalname.split(/!@!/g);
          let tmp_path = file.path;
          let originalname = name_desc[0];
          let description = name_desc[1];
          let fileType = file.mimetype;
          let extension = originalname.match(/([A-Za-z]{1,})$/)[0];
          let date = Date.now().toString();

          let fs_file = fs.createReadStream(tmp_path);

          let params = {
            Bucket: 'neutrino-file-uploads',
            Key: `${username}/${learningObjectID}/${originalname}`,
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
                description: description
              };
              resolve(newLearningObjectFile);
            }
          });
        });
      })
    );
  }

  /**
   * Deletes single file or folder containing all files from S3 bucket
   *
   * @private
   * @param {string} username
   * @param {string} learningObjectID
   * @param {string} filename
   * @returns {Promise<string>}
   * @memberof LearningObjectRepoFileInteractor
   */
  private deleteFromS3(
    username: string,
    learningObjectID: string,
    filename: string,
    deleteAll: boolean = false
  ): Promise<string> {
    let params = deleteAll
      ? {
          Bucket: 'neutrino-file-uploads',
          Key: `${username}/${learningObjectID}`
        }
      : {
          Bucket: 'neutrino-file-uploads',
          Key: `${username}/${learningObjectID}/${filename}`
        };

    return new Promise<string>((resolve, reject) => {
      this._s3.deleteObject(params, (error, data) => {
        if (error) {
          console.log('Errorooror');
          console.log(error);
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }
}
