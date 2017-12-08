import { DataStore } from '../interfaces/DataStore';
import { DB_INTERACTION_URI } from '../config/config'
import * as EVENT from './DatabaseInteractionActions';
import * as rp from 'request-promise';
import { User } from '../entity/entities';

export class DatabaseInteractionConnector implements DataStore {
    constructor() { }
    private async request(event: string, params: {}): Promise<any> {
        return rp({
            method: 'POST',
            uri: DB_INTERACTION_URI + event,
            body: params,
            json: true,
        });
    }
    connectToDB(): Promise<{}> {
        throw new Error("Method not implemented.");
    }

    /**
     * Authenticates user via credentials
     * If credentials valid and user exists; Unserialized User Object is returned
     * Else null is returned
     * Request errors return null
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
     * Registers new user
     * If username unique new user is created; Unserialized User Object is returned
     * Else null is returned
     * Request errors return null
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
        let userid = await this.request(EVENT.ADD_USER, { user: User.serialize(newUser) });
        if (userid && !userid.error) {
            let user = await this.request(EVENT.LOAD_USER, { id: userid });
            if (user && !user.error) {
                return User.unserialize(user);
            }
            return null;
        }
        return null;
    }
    getMyLearningObjects(userid: any) {
        throw new Error("Method not implemented.");
    }
    getLearningObject(learningObjectID: string) {
        throw new Error("Method not implemented.");
    }
    updateLearningObject(learningObject: any) {
        throw new Error("Method not implemented.");
    }
    deleteLearningObject(learningObject: any) {
        throw new Error("Method not implemented.");
    }
    createLearningObject(userid: any, learningObject: any) {
        throw new Error("Method not implemented.");
    }
}

export const EVENTS = {

}