import * as querystring from 'querystring';
export const LEARNING_OBJECT_ROUTES = {
  CREATE_UPDATE_LEARNING_OBJECT: '/learning-objects',
  LOAD_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/learning-objects/${encodeURIComponent(
      username,
    )}/${encodeURIComponent(learningObjectName)}`;
  },
  LOAD_LEARNING_OBJECT_SUMARY: '/learning-objects/summary',
  FIND_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/learning-objects/${encodeURIComponent(
      username,
    )}/${encodeURIComponent(learningObjectName)}/id`;
  },
  DELETE_LEARNING_OBJECT(learningObjectName: string) {
    return `/learning-objects/${encodeURIComponent(learningObjectName)}`;
  },
  PUBLISH_LEARNING_OBJECT: `/learning-objects/publish`,
  UNPUBLISH_LEARNING_OBJECT: `/learning-objects/unpublish`,
  DELETE_MULTIPLE_LEARNING_OBJECTS(learningObjectNames: string[]) {
    return `/learning-objects/${encodeURIComponent(
      learningObjectNames.toString(),
    )}/multiple`;
  },
  FETCH_LEARNING_OBJECTS: '/learning-objects',
  FETCH_USERS_LEARNING_OBJECTS(username: string) {
    return `/users/${encodeURIComponent(username)}/learning-objects`;
  },

  UPLOAD_MATERIALS: `/files`,
  DELETE_FILE(id: string, filename: string) {
    return `/files/${id}/${encodeURIComponent(filename)}`;
  },
  FETCH_MULTIPLE_LEARNING_OBJECTS: '/learning-objects/multiple',
};

export const BUSINESS_CARD_ROUTES = {
  CARD(username: string, query: any) {
    return `/users/${encodeURIComponent(
      username,
    )}/cards?${querystring.stringify(query)}`;
  },
};

export const ADMIN_LEARNING_OBJECT_ROUTES = {
  FETCH_LEARNING_OBJECTS: `/admin/learning-objects`,
  FETCH_LEARNING_OBJECTS_WITH_FILTER(query) {
    return `/admin/learning-objects?${query}`;
  },
  PUBLISH_LEARNING_OBJECT(username, learningObjecID) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${learningObjecID}/publish`;
  },
  UNPUBLISH_LEARNING_OBJECT(username, learningObjecID) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${learningObjecID}/unpublish`;
  },
  DELETE_LEARNING_OBJECT(username, learningObjecID) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${learningObjecID}`;
  },
  DELETE_MULTIPLE_LEARNING_OBJECTS(username, learningObjectIDs) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/multiple/${learningObjectIDs}`;
  },
};
