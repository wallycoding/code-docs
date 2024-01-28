import { lstatSync, existsSync, mkdirSync } from 'node:fs';

export const isDirectory = (currentPath: string) =>
  lstatSync(currentPath).isDirectory();

export const mkdirExistsOrCreate = (path: string) => {
  if (existsSync(path)) return true;
  mkdirSync(path, { recursive: true });
  return false;
};
