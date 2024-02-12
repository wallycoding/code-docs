import { lstatSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'path';

export const isDirectory = (currentPath: string) =>
  lstatSync(currentPath).isDirectory();

export const mkdirExistsOrCreate = (path: string) => {
  if (existsSync(path)) return true;
  mkdirSync(dirname(path), { recursive: true });
  return false;
};
