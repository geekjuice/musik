/* eslint-disable @typescript-eslint/camelcase */

import axios, { AxiosResponse } from 'axios';
import { stringify } from 'querystring';

interface TokenResponse {
  token_type: 'Bearer';
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}

const url = 'https://accounts.spotify.com';

const scopes = ['user-read-currently-playing'];

const auth = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [data => stringify(data)],
});

export const code = (clientId: string, redirectUri: string): string =>
  `${url}/authorize?${stringify({
    state: 'ongaku',
    response_type: 'code',
    scope: scopes.join(' '),
    client_id: clientId,
    redirect_uri: redirectUri,
  })}`;

export const token = (
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<AxiosResponse<TokenResponse>> =>
  auth.post('api/token', {
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
    code,
  });

export const refresh = (
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<AxiosResponse<TokenResponse>> =>
  auth.post('api/token', {
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });
