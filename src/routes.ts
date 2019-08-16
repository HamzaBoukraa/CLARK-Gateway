import * as querystring from 'querystring';

export const BUSINESS_CARD_ROUTES = {
  CARD(username: string, query: any) {
    return `/users/${encodeURIComponent(
      username,
    )}/cards?${querystring.stringify(query)}`;
  },
};
