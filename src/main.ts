import chalk from 'chalk';
import open from 'open';
import prompts from 'prompts';
import * as auth from './auth';
import { ensure } from './credentials';
import { MESSAGE } from './exception';
import { create } from './logger';
import { ask } from './prompt';

const { red } = chalk;

const logger = create('main');

(async (): Promise<void> => {
  try {
    logger.log('starting musik');

    const { clientId, clientSecret, redirectUri } = await ensure(undefined);

    const url = auth.code(clientId, redirectUri);

    open(url);

    const code = await ask('authorization code', 'invisible');

    if (code == null) {
      throw new Error('no authorization code provided');
    }

    const {
      data: { access_token: accessToken, refresh_token: refreshToken },
    } = await auth.token(code, clientId, clientSecret, redirectUri);

    console.log('access_token:', accessToken);
    console.log('refresh_token:', refreshToken);

    logger.log('exiting musik');
    process.exit(0);
  } catch (error) {
    logger.error(error);
    if (error[MESSAGE]) {
      const message = `\n${error[MESSAGE]}`;
      console.log(red(message));
    }
    console.log(red('\n(╯°□°)╯︵ ┻━┻'));
    process.exit(1);
  }
})();
