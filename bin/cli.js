#!/usr/bin/env node

const { program } = require('commander');
const createProject = require('../src/index');

program
  .name('create-vite-react-cli')
  .description('快速创建基于 Vite 的 React 项目')
  .version('1.0.1')
  .argument('[project-name]', '项目名称')
  .action((projectName) => {
    createProject(projectName);
  });

program.parse();

