const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')
const inquirer = require('inquirer')

async function createProject(projectName) {
  try {
    // 如果没有提供项目名称，则询问用户
    if (!projectName) {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '请输入项目名称:',
          default: 'my-vite-react-app',
          validate: (input) => {
            if (!input.trim()) {
              return '项目名称不能为空'
            }
            if (!/^[a-z0-9-]+$/.test(input)) {
              return '项目名称只能包含小写字母、数字和连字符'
            }
            return true
          },
        },
      ])
      projectName = answer.name
    }

    // 验证项目名称格式
    if (!/^[a-z0-9-]+$/.test(projectName)) {
      console.error(chalk.red('错误: 项目名称只能包含小写字母、数字和连字符'))
      process.exit(1)
    }

    const targetDir = path.resolve(process.cwd(), projectName)

    // 检查目录是否已存在
    if (await fs.pathExists(targetDir)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `目录 ${projectName} 已存在，是否覆盖?`,
          default: false,
        },
      ])

      if (overwrite) {
        await fs.remove(targetDir)
      } else {
        console.log(chalk.yellow('操作已取消'))
        process.exit(0)
      }
    }

    const spinner = ora('正在创建项目...').start()

    // 创建项目目录
    await fs.ensureDir(targetDir)

    // 复制模板文件
    const templateDir = path.join(__dirname, '../templates')
    await fs.copy(templateDir, targetDir)

    // 读取并更新 package.json
    const packageJsonPath = path.join(targetDir, 'package.json')
    const packageJson = await fs.readJson(packageJsonPath)
    packageJson.name = projectName
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })

    spinner.succeed('项目创建成功!')

    console.log(chalk.green('\n下一步:'))
    console.log(chalk.cyan(`  cd ${projectName}`))
    console.log(chalk.cyan('  npm install'))
    console.log(chalk.cyan('  npm run dev\n'))
  } catch (error) {
    console.error(chalk.red('创建项目时出错:'), error.message)
    process.exit(1)
  }
}

module.exports = createProject
