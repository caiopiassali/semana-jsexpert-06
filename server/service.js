import fs from 'fs'
import fsPromises from 'fs/promises'
import { join, extname } from 'path'
import config from './config.js'

export class Service {
  createFileStream(filename) {
    return fs.createReadStream(filename)
  }

  async getFileInfo(file) {
    // fullFilePath = home/index.html
    const fullFilePath = join(config.dir.publicDirectory, file)
    // valida se existe, se não existe estoura um erro!!
    await fsPromises.access(fullFilePath)
    const fileType = extname(fullFilePath)

    return {
      type: fileType,
      name: fullFilePath,
    }
  }

  async getFileStream(file) {
    const { name, type } = await this.getFileInfo(file)

    return {
      type,
      stream: this.createFileStream(name),
    }
  }
}
