import { readFile, writeFile } from 'fs';
import { promisify } from 'util';

export const read = promisify(readFile);

export const write = promisify(writeFile);

export const readJSON = async <T extends {}>(filepath: string): Promise<T> => {
  try {
    const json = await read(filepath);
    return JSON.parse(json.toString()) || {};
  } catch (error) {
    return {} as T;
  }
};

export const writeJSON = async <T extends {}>(
  filepath: string,
  json: T
): Promise<void> => {
  await write(filepath, JSON.stringify(json, null, 2));
};

export const updateJSON = async <T extends {}>(
  filepath: string,
  key: keyof T,
  value: string
): Promise<T> => {
  const json = await readJSON(filepath);
  const updated = { ...json, [key]: value };
  await write(filepath, JSON.stringify(updated, null, 2));
  return updated as T;
};
