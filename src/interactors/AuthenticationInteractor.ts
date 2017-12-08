import { DataStore, Responder } from './../interfaces/interfaces';
import { generateToken } from '../drivers/TokenManager';


/**
 * Attempts user login via datastore and issues JWT access token
 * If credentials valid sends user with token
 * Else sends invalidLogin Response via Responder
 * 
 * @export
 * @param {DataStore} dataStore 
 * @param {Responder} responder 
 * @param {string} username 
 * @param {string} password 
 */
export async function login(dataStore: DataStore, responder: Responder, username: string, password: string) {
  // Try to login with the datastore
  // response should be the user object
  let user = await dataStore.login(username, password);
  //If user; Login credentials were valid
  if (user) {
    //Get access token and add to user object
    user['token'] = generateToken(user);
    // Clean user object for safe local storage in the client
    delete user.id;
    responder.sendUser(user);
  } else {
    // Else login credentials were invalid
    // respond with invalid credential message as failure
    responder.invalidLogin();
  }
}

/**
 * Attempt user registraction via datastore and issues JWT access token
 * If username is unique sends user with access token
 * Else sends invalidRegistration Response via Responder
 * 
 * @export
 * @param {DataStore} datastore 
 * @param {Responder} responder 
 * @param {any} user 
 */
export async function register(datastore: DataStore, responder: Responder, user) {
  //Try register with datastore
  // response should be the user object
  let newUser = await datastore.register(user);

  //If newUser; username was available;
  if (newUser) {
    //Get access token and add to user object
    newUser['token'] = generateToken(newUser);
    // Clean user object for safe local storage in the client
    delete newUser.id;
    responder.sendUser(newUser);
  } else {
    //Else username was not available;
    // respond with invalid registration credentials
    responder.invalidRegistration();
  }
}

