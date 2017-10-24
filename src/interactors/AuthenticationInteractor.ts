import { DataStore, Responder } from './../interfaces/interfaces';
import { generateToken } from '../drivers/TokenManager';

export async function login(dataStore: DataStore, responder: Responder) {
    // Try to login with the datastore
    // response should be the user object
    let response = dataStore.login();
    if (isValidLogin(response)) {
      response.token = generateToken(response.userid);
      // Clean user object for safe local storage in the client
      delete response.userid;
      delete response.password;
      delete response.decoded_userpwd;
      responder.sendUser(response);
    } else {
      // respond with invalid credential message as failure
      responder.invalidLogin();
    }
}
/**
 * Obtain connection
 * Attempt to insert into db
 * If error, handle
 * If success, send user info to generateAuthedUser
 * Handle response
 * Release connection
 */
export async function register(datastore: DataStore, responder: Responder) {
    let response = datastore.register();
    if (isValidRegistration(response)) { // FIXME: Does not conform to datastore response
      response.token = generateToken(response.userid);
      responder.sendUser(response);
    } else {
      // respond with invalid registration credentials
      responder.invalidRegistration();
    }
}

function isValidLogin(response) {
  if (response === undefined) {
    // No username exists that matches what was supplied
    return false;
  }
  if (response.password === response.decoded_userpwd) {
    return true;
  } else {
    // Invalid password for supplied username or server error (?)
    return false;
  }
}

function isValidRegistration(response) {
  if (response === undefined) return false;
  else return true;
}
