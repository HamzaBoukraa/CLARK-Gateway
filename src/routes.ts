import * as querystring from 'querystring';
export const LEARNING_OBJECT_ROUTES = {
  CREATE_LEARNING_OBJECT(authorUsername: string) {
    return `/users/${encodeURIComponent(authorUsername)}/learning-objects`;
  },
  UPDATE_LEARNING_OBJECT({ authorUsername, id }: { authorUsername: string; id: string; }) {
    return `/users/${encodeURIComponent(authorUsername)}/learning-objects/${encodeURIComponent(id)}`;
  },
  LOAD_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/learning-objects/${encodeURIComponent(
      username,
    )}/${encodeURIComponent(learningObjectName)}`;
  },
  LOAD_LEARNING_OBJECT_SUMMARY(username: string) {
    return `/users/${encodeURIComponent(username)}/learning-objects`;
  },
  LOAD_USER_PROFILE(username: string) {
    return `/users/${encodeURIComponent(username)}/learning-objects/profile`;
  },
  FIND_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/learning-objects/${encodeURIComponent(
      username,
    )}/${encodeURIComponent(learningObjectName)}/id`;
  },
  DELETE_LEARNING_OBJECT({ authorUsername, id }: { authorUsername: string; id: string; }) {
    return `/users/${encodeURIComponent(authorUsername)}/learning-objects/${encodeURIComponent(id)}`;
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
  SUBMIT_FOR_REVIEW(userId: string, learningObjectId: string, query: {}) {
    return `/users/${encodeURIComponent(userId)}/learning-objects/${encodeURIComponent(learningObjectId)}/submissions?${querystring.stringify(query)}`;
  },

  UPLOAD_MATERIALS: `/files`,
  UPDATE_FILE({ username, learningObjectId, fileId }: { username: string; learningObjectId: string; fileId: string; }) {
    return `/users/${username}/learning-objects/${learningObjectId}/materials/files/${encodeURIComponent(fileId)}`;
  },
  DELETE_FILE({ username, learningObjectId, fileId }: { username: string; learningObjectId: string; fileId: string; }) {
    return `/users/${username}/learning-objects/${learningObjectId}/materials/files/${encodeURIComponent(fileId)}`;
  },
  FETCH_MULTIPLE_LEARNING_OBJECTS: '/learning-objects/multiple',
  ADD_LEARNING_OBJECT_TO_COLLECTION(id: string) {
    return `/learning-objects/${encodeURIComponent(id)}/collections`;
  },
  GET_COLLECTIONS: '/collections',
  UPDATE_PDF(id: string) {
    return `/learning-objects/${id}/pdf`;
  },
  CREATE_CHANGELOG(userId: string, learningObjectId: string) {
    return `/users/${encodeURIComponent(userId)}/learning-objects/${encodeURIComponent(learningObjectId)}/changelog`;
  },
  GET_RECENT_CHANGELOG(userId: string, learningObjectId: string) {
    return `/users/${encodeURIComponent(userId)}/learning-objects/${encodeURIComponent(learningObjectId)}/changelog`;
  },
  GET_ALL_CHANGELOGS(userId: string, learningObjectId: string) {
    return `/users/${encodeURIComponent(userId)}/learning-objects/${encodeURIComponent(learningObjectId)}/changelogs`;
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
  GET_MATERIALS({ username, id, query }: { username: string; id: string; query?: any; }) {
    return `/users/${encodeURIComponent(username)}/learning-objects/${id}/materials?${querystring.stringify(query)}`;
  },
  ADD_MATERIALS(username: string, id: string) {
    return `/users/${encodeURIComponent(username)}/learning-objects/${id}/materials/files`;
  },
  GET_LEARNING_OBJECT_CHILDREN(learningObjectID: string) {
    return `/learning-objects/${encodeURIComponent(
      learningObjectID,
    )}/children/summary`;
  },
};

export const FILE_UPLOAD_ROUTES = {
  INIT_MULTIPART(params: {
    username: string;
    objectId: string;
    fileId: string;
  }) {
    return `/users/${encodeURIComponent(params.username)}/learning-objects/${
      params.objectId
    }/files/${params.fileId}/multipart`;
  },
  FINALIZE_MULTIPART(params: {
    username: string;
    objectId: string;
    fileId: string;
    uploadId: string;
  }) {
    return `/users/${encodeURIComponent(params.username)}/learning-objects/${
      params.objectId
    }/files/${params.fileId}/multipart/${params.uploadId}`;
  },
  ABORT_MULTIPART(params: {
    username: string;
    objectId: string;
    fileId: string;
    uploadId: string;
  }) {
    return `/users/${encodeURIComponent(params.username)}/learning-objects/${
      params.objectId
    }/files/${params.fileId}/multipart/${params.uploadId}`;
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
  FETCH_LEARNING_OBJECTS_WITH_FILTER(query: any) {
    return `/admin/learning-objects?${querystring.stringify(query)}`;
  },
  UPDATE_OBJECT() {
    return `/admin/learning-objects`;
  },
  GET_FULL_OBJECT(learningObjectId: string) {
    return `/admin/learning-objects/${encodeURIComponent(learningObjectId)}`;
  },
  PUBLISH_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}/publish`;
  },
  UNPUBLISH_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}/unpublish`;
  },
  LOCK_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}/lock`;
  },
  UNLOCK_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}/unlock`;
  },
  DELETE_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/${encodeURIComponent(learningObjectName)}`;
  },
  DELETE_MULTIPLE_LEARNING_OBJECTS(username: string, learningObjectIDs: string) {
    return `/admin/users/${encodeURIComponent(
      username,
    )}/learning-objects/multiple/${learningObjectIDs}`;
  },
};

export const ADMIN_USER_ROUTES = {
  FETCH_USERS_WITH_FILTER(query: any) {
    return `/admin/users?${querystring.stringify(query)}`;
  },
  DELETE_USER(id: string) {
    return `/admin/users/${id}`;
  },
  FETCH_COLLECTION_MEMBERS(collectionName: string, query: string) {
    return `/collections/${encodeURIComponent(
      collectionName,
    )}/members?${querystring.stringify(query)}`;
  },
  ASSIGN_COLLECTION_MEMBERSHIP(collectionName: string, memberId: string) {
    return `/collections/${encodeURIComponent(
      collectionName,
    )}/members/${encodeURIComponent(
      memberId,
    )}`;
  },
  EDIT_COLLECTION_MEMBERSHIP(collectionName: string, memberId: string) {
    return `/collections/${encodeURIComponent(
      collectionName,
    )}/members/${encodeURIComponent(
      memberId,
    )}`;
  },
  REMOVE_COLLECTION_MEMBERSHIP(collectionName: string, memberId: string) {
    return `/collections/${encodeURIComponent(collectionName)}/members/${encodeURIComponent(memberId)}`;
  },
  FETCH_USER_ROLES(id: string) {
    return `/users/${id}/roles`;
  },
};

export const ADMIN_MAILER_ROUTES = {
  SEND_BASIC_EMAIL: `/admin/mail`,
  GET_AVAILABLE_TEMPLATES: `/admin/mail/templates`,
  SEND_TEMPLATE_EMAIL: `/admin/mail/templates`,
};

export const STATS_ROUTE = {
  USER_STATS: '/users/stats',
  LEARNING_OBJECT_STATS: '/learning-objects/stats',
};
