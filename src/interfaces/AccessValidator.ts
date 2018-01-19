export interface AccessValidator {
  authorize(user: any): AccessResponse;
}

export interface AccessResponse {
  userid: string;
  isAccessable: boolean;
}
