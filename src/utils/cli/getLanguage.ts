import * as fs from 'node:fs'
import * as path from 'node:path'

interface LanguageItem {
  hint?: string
  message: string
  invalidMessage?: string
  dirForPrompts?: {
    current: string
    target: string
  }
  toggleOptions?: {
    active: string
    inactive: string
  }
  selectOptions?: {
    [key: string]: { title: string; desc?: string }
  }
}

export interface Language {
  projectName: LanguageItem
  shouldOverwrite: LanguageItem
  packageName: LanguageItem
  featureSelection: LanguageItem
  needsTypeScript: LanguageItem
  needsEslint: LanguageItem
  needsPrettier: LanguageItem
  errors: {
    operationCancelled: string
  }
  defaultToggleOptions: {
    active: string
    inactive: string
  }
  infos: {
    scaffolding: string
    done: string
    optionalGitCommand: string
  }
}

function linkLocale(locale: string) {
  if (locale === 'C') {
    return 'en-US'
  }

  let linkedLocale: string = locale
  try {
    linkedLocale = Intl.getCanonicalLocales(locale)[0]
  } catch (error) {
    console.log(`${(error as Error).toString()}, invalid language tag: "${locale}"\n`)
  }
  switch (linkedLocale) {
    case 'zh-CN':
    case 'zh-SG':
      linkedLocale = 'zh-Hans'
      break
    default:
      linkedLocale = locale
  }

  return linkedLocale
}

function getLocale() {
  const shellLocale =
    process.env.LC_ALL ||
    process.env.LC_MESSAGES ||
    process.env.LANG ||
    Intl.DateTimeFormat().resolvedOptions().locale ||
    'en-US'

  return linkLocale(shellLocale.split('.')[0].replace('_', '-'))
}

async function loadLanguageFile(filePath: string): Promise<Language> {
  return await fs.promises.readFile(filePath, 'utf-8').then((data) => {
    const parsedData = JSON.parse(data)
    if (parsedData) {
      return parsedData
    }
  })
}

export default async function getLanguage(localesRoot: string) {
  const locale = getLocale()

  const languageFilePath = path.resolve(localesRoot, `${locale}.json`)
  const fallbackPath = path.resolve(localesRoot, 'en-US.json')

  const doesLanguageExist = fs.existsSync(languageFilePath)
  const lang: Language = doesLanguageExist
    ? await loadLanguageFile(languageFilePath)
    : await loadLanguageFile(fallbackPath)

  return lang
}
