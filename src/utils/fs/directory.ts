import * as fs from 'node:fs';
import { dotGitDirectoryState, postOrderDirectoryTraverse } from './directoryTraverse';

export function canSkipEmptying(dir: string) {
  if (!fs.existsSync(dir)) {
    return true;
  }

  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    return true;
  }

  if (files.length === 1 && files[0] === '.git') {
    dotGitDirectoryState.hasDotGitDirectory = true;
    return true;
  }

  return false;
}

export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }

  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file),
  );
}
