export interface AccessValidator {
  authorize(user: any): AccessResponse;
}

export interface AccessResponse {
  userid: number;
  isAccessable: boolean;
}
