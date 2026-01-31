import { fileURLToPath } from 'node:url'
import getLanguage from './utils/cli/getLanguage'

// 这里的 await 会阻塞所有引用它的模块，直到加载完成
export const language = await getLanguage(fileURLToPath(new URL('../locales', import.meta.url)))
