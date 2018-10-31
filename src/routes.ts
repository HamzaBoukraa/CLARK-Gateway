import * as querystring from 'querystring';
export const LEARNING_OBJECT_ROUTES = {
  CREATE_UPDATE_LEARNING_OBJECT: '/learning-objects',
  LOAD_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/learning-objects/${encodeURIComponent(
      username,
    )}/${encodeURIComponent(learningObjectName)}`;
  },
  LOAD_LEARNING_OBJECT_SUMMARY(username: string) {
    return `/users/${encodeURIComponent(username)}/learning-objects`;
  },
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
  ADD_LEARNING_OBJECT_TO_COLLECTION(id) {
    return `/learning-objects/${encodeURIComponent(id)}/collections`;
  },
  GET_COLLECTIONS: '/collections',
  UPDATE_PDF(id: string) {
    return `/learning-objects/${id}/pdf`;
  },
  DOWNLOAD_FILE(params: {
    username: string;
    id: string;
    fileId: string;
    query: any;
  }) {
    return `/users/${params.username}/learning-objects/${params.id}/files/${
      params.fileId
    }/download?${querystring.stringify(params.query)}`;
  },
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
    return `/admin/learning-objects?${querystring.stringify(query)}`;
  },
  PUBLISH_LEARNING_OBJECT(username, learningObjectName) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}/publish`;
  },
  UNPUBLISH_LEARNING_OBJECT(username, learningObjectName) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}/unpublish`;
  },
  LOCK_LEARNING_OBJECT(username, learningObjectName) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}/lock`;
  },
  UNLOCK_LEARNING_OBJECT(username, learningObjectName) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}/unlock`;
  },
  DELETE_LEARNING_OBJECT(username, learningObjectName) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}`;
  },
  DELETE_MULTIPLE_LEARNING_OBJECTS(username, learningObjectIDs) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/multiple/${learningObjectIDs}`;
  },
};

export const ADMIN_USER_ROUTES = {
  FETCH_USERS_WITH_FILTER(query) {
    return `/admin/users?${querystring.stringify(query)}`;
  },
  DELETE_USER(id: string) {
    return `/admin/users/${id}`;
  },
};

export const ADMIN_MAILER_ROUTES = {
  SEND_BASIC_EMAIL: `/admin/mail`,
  GET_AVAILABLE_TEMPLATES: `/admin/mail/templates`,
  SEND_TEMPLATE_EMAIL: `/admin/mail/templates`,
};
