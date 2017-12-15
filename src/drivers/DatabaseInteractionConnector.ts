import { DataStore } from '../interfaces/DataStore';
import { DB_INTERACTION_URI } from '../config/config'
import * as EVENT from './DatabaseInteractionActions';
import * as rp from 'request-promise';
import { User } from '../entity/entities';
import { LearningObject } from '../entity/learning-object';

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
     * Creates new LearningObject
     * 
     * @param {string} username 
     * @param {*} learningObject 
     * @returns {Promise<string>} learningObjectID
     * @memberof DatabaseInteractionConnector
     */
    async createLearningObject(username: string, learningObject: any): Promise<string> {
        let userid = await this.request(EVENT.FIND_USER, { userid: username });
        if (!userid || userid.error) return null;

        let user = await this.request(EVENT.LOAD_USER, { id: userid });
        if (!user || user.error) return null;

        let newLearningObject = new LearningObject(user, learningObject._name);
        newLearningObject.date = learningObject._date;
        newLearningObject.length = learningObject._length;

        learningObject._goals.forEach(goal => {
            let newGoal = newLearningObject.addGoal();
            newGoal.text = goal._text;
        });

        learningObject._outcomes.forEach(outcome => {
            let newOutcome = newLearningObject.addOutcome();
            newOutcome.bloom = outcome._class;
            newOutcome.verb = outcome._verb;
            newOutcome.text = outcome._text;

            outcome._assessments.forEach(question => {
                let newQuestion = newOutcome.addAssessment();
                newQuestion.plan = question._plan;
                newQuestion.text = question._text;
            });

            outcome._strategies.forEach(strategy => {
                let newStrategy = newOutcome.addStrategy();
                newStrategy.instruction = strategy._instruction;
                newStrategy.text = strategy._text;
            });
        });
        let learningObjectID = await this.request(EVENT.ADD_LEARNING_OBJECT, { author: userid, object: LearningObject.serialize(newLearningObject) });
        if (!learningObjectID || learningObjectID.error) return null;

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
        if (!userid || userid.error) return null;

        let LOs = await this.request(EVENT.LOAD_LEARNING_OBJECT_SUMARY, { id: userid });

        let user = await this.request(EVENT.LOAD_USER, { id: userid });
        if (!user || user.error) return null;
        user = User.unserialize(user);

        // Attach id's to learning objects and return array of Learning Objects
        return Promise.all(LOs.map((learningObject) => {
            learningObject = LearningObject.unserialize(learningObject, user);
            return new Promise<LearningObject>((resolve, reject) => {
                this.request(EVENT.FIND_LEARNING_OBJECT, { author: userid, name: learningObject['_name'] })
                    .then((learningObjectID) => {
                        if (!learningObjectID || learningObjectID.error) {
                            reject(learningObjectID);
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
        if (!userid || userid.error) return null;

        let user = await this.request(EVENT.LOAD_USER, { id: userid });
        if (!user || user.error) return null;
        user = User.unserialize(user);

        let learningObject = await this.request(EVENT.LOAD_LEARNING_OBJECT, { id: learningObjectID });
        if (!learningObject || learningObject.error) return null;

        learningObject = LearningObject.unserialize(learningObject, user);

        // Remove source property causing Type Error
        learningObject.goals.forEach(goal => {
            delete goal._source;
        });
        learningObject.outcomes.forEach(outcome => {
            delete outcome._source;

            outcome._assessments.forEach(assessment => {
                delete assessment._source;
            });
            outcome._strategies.forEach(strategy => {
                delete strategy._source;
            });
        });
        return learningObject;
    }

    /**
     * Updates Learning Object
     * 
     * @param {*} learningObject 
     * @returns 
     * @memberof DatabaseInteractionConnector
     */
    async updateLearningObject(learningObject: any): Promise<any> {
        let userid = await this.request(EVENT.FIND_USER, { userid: learningObject['_author']['_id'] });
        if (!userid || userid.error) return null;

        let user = await this.request(EVENT.LOAD_USER, { id: userid });
        if (!user || user.error) return null;

        let newLearningObject = new LearningObject(user, learningObject._name);
        newLearningObject.date = learningObject._date;
        newLearningObject.length = learningObject._length;

        learningObject._goals.forEach(goal => {
            let newGoal = newLearningObject.addGoal();
            newGoal.text = goal._text;
        });

        learningObject._outcomes.forEach(outcome => {
            let newOutcome = newLearningObject.addOutcome();
            newOutcome.bloom = outcome._bloom;
            newOutcome.verb = outcome._verb;
            newOutcome.text = outcome._text;

            outcome._assessments.forEach(question => {
                let newQuestion = newOutcome.addAssessment();
                newQuestion.plan = question._plan;
                newQuestion.text = question._text;
            });

            outcome._strategies.forEach(strategy => {
                let newStrategy = newOutcome.addStrategy();
                newStrategy.instruction = strategy._instruction;
                newStrategy.text = strategy._text;
            });
        });
        return this.request(EVENT.UPDATE_LEARNING_OBJECT, { id: learningObject['id'], object: LearningObject.serialize(newLearningObject) });
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