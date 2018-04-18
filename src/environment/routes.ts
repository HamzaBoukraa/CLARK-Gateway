import * as querystring from 'querystring';
export const LEARNING_OBJECT_ROUTES = {
  CREATE_UPDATE_LEARNING_OBJECT: '/learning-objects',
  LOAD_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/learning-objects/${username}/${encodeURIComponent(
      learningObjectName,
    )}`;
  },
  LOAD_LEARNING_OBJECT_SUMARY: '/learning-objects/summary',
  FIND_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/learning-objects/${username}/${encodeURIComponent(
      learningObjectName,
    )}/id`;
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
    return `/users/${username}/learning-objects`;
  },

  UPLOAD_MATERIALS: `/files`,
  DELETE_FILE(id: string, filename: string) {
    return `/files/${id}/${encodeURIComponent(filename)}`;
  },
  FETCH_MULTIPLE_LEARNING_OBJECTS: '/learning-objects/multiple',
};

export const BUSINESS_CARD_ROUTES = {
  CARD(username: string, query: any) {
    return `/users/${username}/cards?${querystring.stringify(query)}`;
  },
};
