export interface AccessValidator {
  authenticate(): AccessResponse;
}

export interface AccessResponse {
  userid: number;
  isAccessable: boolean;
}
