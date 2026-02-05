import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import renderTemplate from '../src/utils/fs/renderTemplate';

const TEMP_DIR = path.resolve(__dirname, 'temp-render-test');
const SRC_DIR = path.resolve(TEMP_DIR, 'src');
const DEST_DIR = path.resolve(TEMP_DIR, 'dest');

describe('renderTemplate', () => {
  beforeEach(() => {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(SRC_DIR, { recursive: true });
    fs.mkdirSync(DEST_DIR, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
  });

  it('should copy files', () => {
    const filename = 'test.txt';
    const content = 'hello world';
    fs.writeFileSync(path.join(SRC_DIR, filename), content);

    renderTemplate(path.join(SRC_DIR, filename), path.join(DEST_DIR, filename), []);

    expect(fs.existsSync(path.join(DEST_DIR, filename))).toBe(true);
    expect(fs.readFileSync(path.join(DEST_DIR, filename), 'utf8')).toBe(content);
  });

  it('should merge package.json', () => {
    const existingPkg = {
      dependencies: {
        react: '^17.0.0',
      },
    };
    const newPkg = {
      dependencies: {
        'react-dom': '^17.0.0',
      },
      devDependencies: {
        vite: '^2.0.0',
      },
    };

    fs.writeFileSync(path.join(DEST_DIR, 'package.json'), JSON.stringify(existingPkg));
    fs.writeFileSync(path.join(SRC_DIR, 'package.json'), JSON.stringify(newPkg));

    renderTemplate(path.join(SRC_DIR, 'package.json'), path.join(DEST_DIR, 'package.json'), []);

    const result = JSON.parse(fs.readFileSync(path.join(DEST_DIR, 'package.json'), 'utf8'));
    expect(result.dependencies).toEqual({
      react: '^17.0.0',
      'react-dom': '^17.0.0',
    });
    expect(result.devDependencies).toEqual({
      vite: '^2.0.0',
    });
  });

  it('should rename _filename to .filename', () => {
    const filename = '_gitignore';
    const content = 'node_modules';
    fs.writeFileSync(path.join(SRC_DIR, filename), content);

    renderTemplate(SRC_DIR, DEST_DIR, []);

    expect(fs.existsSync(path.join(DEST_DIR, '.gitignore'))).toBe(true);
    expect(fs.readFileSync(path.join(DEST_DIR, '.gitignore'), 'utf8')).toBe(content);
  });
});
