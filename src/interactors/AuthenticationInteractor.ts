import { DataStore, Responder } from './../interfaces/interfaces';
import { generateToken } from '../drivers/TokenManager';

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
    delete user.password;
    responder.sendUser(user);
  } else {
    // Else login credentials were invalid
    // respond with invalid credential message as failure
    responder.invalidLogin();
  }
}

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
    delete newUser.password;
    responder.sendUser(newUser);
  } else {
    //Else username was not available;
    // respond with invalid registration credentials
    responder.invalidRegistration();
  }
}

