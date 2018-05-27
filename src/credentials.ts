import { homedir } from 'os';
import { join, resolve } from 'path';
import { ask } from './prompt';
import {
  NODE_ENV,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} from './env';
import { readJSON, writeJSON, updateJSON } from './filesystem';
import { create } from './logger';

export type Credentials = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

const logger = create('auth');

const DEFAULT_CONFIG = join(homedir(), '.musik');

const getConfigPath = (filepath: string = DEFAULT_CONFIG): string => {
  logger.log(`resolving path for '${filepath}'`);
  const normalized = filepath.startsWith('~')
    ? filepath.replace(/^~/, homedir())
    : filepath;
  return resolve(normalized);
};

const getLocalCredentials = (): Credentials => ({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: SPOTIFY_REDIRECT_URI,
});

export const get = async (
  filepath: string | undefined
): Promise<Credentials | null> => {
  if (NODE_ENV === 'development') {
    logger.log('using  from environment');
    return getLocalCredentials();
  }

  const configPath = getConfigPath(filepath);

  try {
    logger.log('reading credentials from config');
    const config = await readJSON<Credentials>(configPath);

    if (config) {
      logger.log('credentials found');
      return config;
    }

    logger.log('no config found');
  } catch (error) {
    logger.error('failed to read config');
  }

  logger.warn(`no credentials found`);
  return null;
};

export const set = async (
  filepath: string | undefined,
  credentials: Partial<Credentials>
): Promise<void> => {
  const configPath = getConfigPath(filepath);

  try {
    logger.log(`writing credentials to config`);
    await writeJSON(configPath, credentials);
  } catch (error) {
    logger.error(`failed to write config`);
  }
};

export const update = async (
  filepath: string,
  key: keyof Credentials,
  value: string
): Promise<Partial<Credentials>> => {
  const configPath = getConfigPath(filepath);

  try {
    logger.log(`writing credentials to config`);
    const credentials = await updateJSON<Partial<Credentials>>(
      configPath,
      key,
      value
    );
    return credentials;
  } catch (error) {
    logger.error(`failed to write config`);
  }
};

export const reset = async (filepath: string | undefined): Promise<void> => {
  logger.log(`clearing credentials token`);
  await set(filepath, {});
};

export const ensure = async (
  filepath: string | undefined
): Promise<Credentials> => {
  logger.log(`ensuring credentials`);

  const cached = await get(filepath);
  const { clientId, clientSecret, redirectUri } = cached;

  if (clientId && clientSecret && redirectUri) {
    logger.log(`using cached credentials`);
    return cached;
  }

  if (!clientId) {
    cached.clientId = await ask('spotify client id');
  }

  if (!clientId) {
    cached.clientSecret = await ask('spotify client secret', 'password');
  }

  if (!redirectUri) {
    cached.redirectUri = await ask('spotify redirect uri');
  }

  await set(filepath, cached);

  return cached;
};
