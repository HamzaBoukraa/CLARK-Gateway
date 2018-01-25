import { DataStore } from '../interfaces/DataStore';
import { DB_INTERACTION_URI, LO_SUGGESTION_URI } from '../config/config';
import * as EVENT from './DBInteractionActions';
import * as rp from 'request-promise';
import { LearningObject, User } from '@cyber4all/clark-entity';
import * as request from 'request';

export class DBInteractionConnector implements DataStore {

    constructor() { }

    /**
     * Registers new user
     * If username unique new user is created; Unserialized User Object is returned
     *
     * @param {username: string, firstname: string, lastname: string, email: string, password: string} user
     * @returns {Promise<User>}
     * @memberof DatabseInteractionConnector
     */
    async register(user: { username: string, firstname: string, lastname: string, email: string, password: string }): Promise<User> {
        let newUser = new User(
            user.username,
            `${user.firstname} ${user.lastname}`,
            user.email,
            user.password
        );
        let emailRegistered = await this.request(DB_INTERACTION_URI, EVENT.CHECK_EMAIL_REGISTERED, { email: user.email });
        if (emailRegistered) return Promise.reject('email');

        let userid = await this.request(DB_INTERACTION_URI, EVENT.ADD_USER, { user: User.serialize(newUser) });
        if (userid && !userid.error) {
            let user = await this.request(DB_INTERACTION_URI, EVENT.LOAD_USER, { id: userid });
            if (user && !user.error) {
                return User.unserialize(user);
            }
            return Promise.reject(user.error);
        }
        return Promise.reject(userid.error);
    }

    /**
     * Authenticates user via credentials
     * If credentials valid and user exists; Unserialized User Object is returned
     *
     * @param {string} username user's username
     * @param {string} password user's password
     * @returns {Promise<User>} Promise of User object in DB or null
     * @memberof DatabseInteractionConnector
     */
    async login(username: string, password: string): Promise<User> {
        let authenticated = await this.request(DB_INTERACTION_URI, EVENT.AUTHENTICATE, { userid: username, pwd: password });
        if (authenticated && !authenticated.error) {
            let userid = await this.request(DB_INTERACTION_URI, EVENT.FIND_USER, { userid: username });
            if (userid && !userid.error) {
                let user = await this.request(DB_INTERACTION_URI, EVENT.LOAD_USER, { id: userid });
                if (user && !user.error) {
                    return User.unserialize(user);
                }
                return null;
            }
            return null;
        }
        return null;
    }

    /**
     * Creates new LearningObject
     *
     * @param {string} username
     * @param {*} learningObject
     * @returns {Promise<string>} learningObjectID
     * @memberof DatabaseInteractionConnector
     */
    async createLearningObject(username: string, learningObject: any): Promise<string> {
        let learningObjectID = await this.request(DB_INTERACTION_URI, EVENT.ADD_LEARNING_OBJECT, { author: username, object: LearningObject.serialize(learningObject) });
        if (!learningObjectID || learningObjectID.error) return Promise.reject(learningObjectID.error);

        return learningObjectID;
    }

    /**
     * Reads User's LearningObjects and Attaches ids
     *
     * @param {string} username
     * @returns {Promise<Array<LearningObject>>}
     * @memberof DatabaseInteractionConnector
     */
    async getMyLearningObjects(username: string): Promise<any> {
        let objects = await this.request(DB_INTERACTION_URI, EVENT.LOAD_LEARNING_OBJECT_SUMARY + `/${username}`, {}, 'GET');
        return objects;
    }

    /**
     * Gets LearningObject by ID
     *
     * @param {string} username
     * @param {string} learningObjectID
     * @returns {Promise<LearningObject>}
     * @memberof DatabaseInteractionConnector
     */
    async getLearningObject(username: string, learningObjectName: string): Promise<LearningObject> {

        // tslint:disable-next-line:max-line-length
        let learningObject = await this.request(DB_INTERACTION_URI, `${EVENT.LOAD_LEARNING_OBJECT}/${username}/${learningObjectName}`, {}, 'GET');
        if (!learningObject || learningObject.error) return Promise.reject(learningObject.error);

        return learningObject;
    }

    /**
     * Updates Learning Object
     *
     * @param {*} learningObject
     * @returns
     * @memberof DatabaseInteractionConnector
     */
    async updateLearningObject(username: string, learningObjectID: string, learningObject: any): Promise<any> {


        // If object then there is an error
        // tslint:disable-next-line:max-line-length
        let object = await this.request(DB_INTERACTION_URI, EVENT.UPDATE_LEARNING_OBJECT, { id: learningObjectID, object: learningObject }, 'PATCH');

        if (object.error) {
            return Promise.reject(object.error);
        }

        return null;
    }

    /**
     * Deletes Learning Object
     *
     * @param {string} learningObjectID
     * @returns {Promise<any>}
     * @memberof DatabaseInteractionConnector
     */
    async deleteLearningObject(username: string, learningObjectName: string): Promise<any> {
        return this.request(DB_INTERACTION_URI, EVENT.DELETE_LEARNING_OBJECT + `/${username}/${learningObjectName}`, { }, 'DELETE');
    }

    async deleteLearningObjects(username: string, learningObjectNames: string[]): Promise<any> {
        return this.request(DB_INTERACTION_URI, EVENT.DELETE_MULTIPLE_LEARNING_OBJECTS + `/${username}/${learningObjectNames}`, {}, 'DELETE');
    }

// CUBE
    async readLearningObjects(): Promise<string[]> {
        return await this.request(DB_INTERACTION_URI, EVENT.FETCH_LEARNING_OBJECTS, {}, 'get');
    }

    async readLearningObject(author: string, learningObjectName: string): Promise<string> {
        return await this.request(DB_INTERACTION_URI, `${EVENT.LOAD_LEARNING_OBJECT}/${author}/${learningObjectName}`, {}, 'GET');
    }

    async readMultipleLearningObjects(ids: string[], fullObject: boolean): Promise<string[]> {
        if (fullObject) {
          return Promise.all(
              // TODO: Update to utilize cart-service
            ids.map((id) => {
              return this.readLearningObject(id);
            })
          );
        } else {
          return this.request(DB_INTERACTION_URI, EVENT.FETCH_MULTIPLE_LEARNING_OBJECTS, { ids: ids });
        }
    }
// END CUBE

    private async request(URI: string, event: string, params: {}, method?: string): Promise<any> {
        return rp({
            method: method ? method : 'POST',
            uri: URI + event,
            body: params,
            json: true,
        });
    }
}
