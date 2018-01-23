import { DataStore } from '../interfaces/DataStore';
import { DB_INTERACTION_URI } from '../config/config'
import * as EVENT from './DBInteractionActions';
import * as rp from 'request-promise';
import { LearningObject, User } from '@cyber4all/clark-entity';

export class DBInteractionConnector implements DataStore {
    constructor() { }
    private async request(event: string, params: {}): Promise<any> {
        return rp({
            method: 'POST',
            uri: DB_INTERACTION_URI + event,
            body: params,
            json: true,
        });
    }

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
        let emailRegistered = await this.request(EVENT.CHECK_EMAIL_REGISTERED, { email: user.email });
        if (emailRegistered) return Promise.reject('email');

        let userid = await this.request(EVENT.ADD_USER, { user: User.serialize(newUser) });
        if (userid && !userid.error) {
            let user = await this.request(EVENT.LOAD_USER, { id: userid });
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
        let authenticated = await this.request(EVENT.AUTHENTICATE, { userid: username, pwd: password });
        if (authenticated && !authenticated.error) {
            let userid = await this.request(EVENT.FIND_USER, { userid: username });
            if (userid && !userid.error) {
                let user = await this.request(EVENT.LOAD_USER, { id: userid });
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
        let userid = await this.request(EVENT.FIND_USER, { userid: username });
        if (!userid || userid.error) return Promise.reject(userid.error);

        let user = await this.request(EVENT.LOAD_USER, { id: userid });
        if (!user || user.error) return Promise.reject(user.error);

        learningObject = LearningObject.unserialize(JSON.stringify(learningObject), user);
        learningObject = LearningObject.serialize(learningObject);

        let learningObjectID = await this.request(EVENT.ADD_LEARNING_OBJECT, { author: userid, object: learningObject });
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
        let userid = await this.request(EVENT.FIND_USER, { userid: username });
        if (!userid || userid.error) return Promise.reject(userid.error);

        let LOs = await this.request(EVENT.LOAD_LEARNING_OBJECT_SUMARY, { id: userid });

        let user = await this.request(EVENT.LOAD_USER, { id: userid });
        if (!user || user.error) return Promise.reject(user.error);
        user = User.unserialize(user);

        // Attach id's to learning objects and return array of Learning Objects
        return Promise.all(LOs.map((learningObject) => {
            learningObject = LearningObject.unserialize(learningObject, user);
            return new Promise<LearningObject>((resolve, reject) => {
                this.request(EVENT.FIND_LEARNING_OBJECT, { author: userid, name: learningObject['_name'] })
                    .then((learningObjectID) => {
                        if (!learningObjectID || learningObjectID.error) {
                            reject(learningObjectID.error);
                        } else {
                            learningObject['id'] = learningObjectID;
                            resolve(learningObject);
                        }
                    });
            });
        }));
    }

    /**
     * Gets LearningObject by ID
     * 
     * @param {string} username 
     * @param {string} learningObjectID 
     * @returns {Promise<LearningObject>} 
     * @memberof DatabaseInteractionConnector
     */
    async getLearningObject(username: string, learningObjectID: string): Promise<LearningObject> {
        let userid = await this.request(EVENT.FIND_USER, { userid: username });
        if (!userid || userid.error) return Promise.reject(userid.error);

        let user = await this.request(EVENT.LOAD_USER, { id: userid });
        if (!user || user.error) return Promise.reject(user.error);
        user = User.unserialize(user);

        let learningObject = await this.request(EVENT.LOAD_LEARNING_OBJECT, { id: learningObjectID });
        if (!learningObject || learningObject.error) return Promise.reject(learningObject.error);

        learningObject = JSON.parse(learningObject);
        learningObject['author'] = user;
        learningObject = JSON.stringify(learningObject);

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

        let userid = await this.request(EVENT.FIND_USER, { userid: username });
        if (!userid || userid.error) return Promise.reject(userid.error);

        let user = await this.request(EVENT.LOAD_USER, { id: userid });
        if (!user || user.error) return Promise.reject(user.error);

        learningObject = LearningObject.unserialize(learningObject, user);
        learningObject = LearningObject.serialize(learningObject);

        //If object then there is an error
        let object = await this.request(EVENT.UPDATE_LEARNING_OBJECT, { id: learningObjectID, object: learningObject });

        if (object) {
            return Promise.reject(object.error)
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
    async deleteLearningObject(learningObjectID: string): Promise<any> {
        return this.request(EVENT.DELETE_LEARNING_OBJECT, { id: learningObjectID });
    }


}