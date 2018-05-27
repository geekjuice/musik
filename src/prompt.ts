import prompts from 'prompts';
import { create } from './logger';

const logger = create('prompt');

type PromptTypes = 'text' | 'password' | 'invisible';

export const ask = async (
  name: string,
  type: PromptTypes = 'text'
): Promise<string> => {
  logger.log(`requesting user for '${name}'`);

  const { answer } = await prompts({
    type,
    name: 'answer',
    message: `enter ${name}`,
  });

  if (answer == null) {
    process.exit(1);
  }

  return answer;
};
