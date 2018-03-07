export const LEARNING_OBJECT_ROUTES = {
  CREATE_UPDATE_LEARNING_OBJECT: '/learning-objects',
  LOAD_DELETE_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/learning-objects/${username}/${encodeURIComponent(
      learningObjectName
    )}`;
  },
  LOAD_LEARNING_OBJECT_SUMARY(username: string): string {
    return `/learning-objects/${username}/summary`;
  },
  FIND_LEARNING_OBJECT(username: string, learningObjectName: string) {
    return `/learning-objects/${username}/${encodeURIComponent(
      learningObjectName
    )}/id`;
  },
  DELETE_MULTIPLE_LEARNING_OBJECT(
    username: string,
    learningObjectNames: string[]
  ) {
    return `/learning-objects/${username}/${encodeURIComponent(
      learningObjectNames.toString()
    )}/multiple`;
  },
  FETCH_LEARNING_OBJECTS: '/learning-objects'
};

export const FETCH_MULTIPLE_LEARNING_OBJECTS = '/learning-objects/multiple';
