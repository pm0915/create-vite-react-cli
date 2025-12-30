import { createProject } from './create'

createProject(process.argv[2]).catch((err) => {
  console.error(err)
  process.exit(1)
})
