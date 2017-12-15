import { DataStore } from '../interfaces/DataStore';

import * as loki from 'lokijs';

import * as bcrypt from 'bcrypt-nodejs';
import { User } from '../entity/user';
import { LearningObject } from '../entity/entities';

export class InMemoryConnector implements DataStore {


    private db: loki = new loki('loki.json');
    private learningObjects: any;
    private users: any;

    constructor() {
        this.users = this.db.addCollection('users');
        this.learningObjects = this.db.addCollection('learningObjects');

        let defaultUser: User = this.createDefaultUser();
        this.createDefaultLO(defaultUser);

    }

    private createDefaultUser(): User {
        let newUser = new User(
            'test',
            'Tester Test',
            'test@test.com',
            'password'
        );
        this.users.insert({ user: User.serialize(newUser) });
        return newUser;
    }
    private createDefaultLO(user: User): void {
        let newLearningObject = new LearningObject(
            user,
            'Test Learning Object'
        );
        newLearningObject.date = Date.now().toString();
        for (let i = 0; i < 5; i++) {

        }
    }
    async login(username: string, password: string) {
        let possibleUser = this.users.findOne({ username: username });
        if (!possibleUser) {
            return null;
        }
        let user;
        await bcrypt.compare(password, possibleUser.password, (error, match) => {
            // if (match || possibleUser.password === password) {
            //     user = possibleUser;
            // }
            user = match || possibleUser.password == password ? possibleUser :
                null;
        });
        return user;
    }
    async register(user) {
        let exisiting = this.users.findOne({ username: user.username });
        if (!exisiting) {
            let newUser = {
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            };
            await bcrypt.hash(user.password, null, null, (error, hash) => {
                newUser['password'] = hash;
            });

            this.users.insert(newUser);
            return newUser;
        }
        return null;
    }
    getMyLearningObjects(userid) {
        return this.learningObjects.data;
    }
    getLearningObject(learningObjectID) {
        return this.learningObjects.findOne({ id: learningObjectID });
    }
    updateLearningObject(learningObject: any) {
        // throw new Error('Method not implemented.');
        this.learningObjects.update(learningObject);
        return learningObject;
    }
    deleteLearningObject(learningObject: any) {
        this.learningObjects.findAndRemove(learningObject);
    }
    createLearningObject(userid: any, learningObject: any) {
        learningObject['id'] = learningObject.date + learningObject.name.replace(/\s/g, '').toLowerCase();
        this.learningObjects.insert(learningObject)
        return learningObject;
    }
}
