import { resolve, dirname } from 'path';

let home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

export default function homedir(username?: string): string {
  return username ? resolve(dirname(home), username) : home;
}

