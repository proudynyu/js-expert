import { Readable, Writable, Transform } from 'stream'
import { jest } from '@jest/globals'

export default class TestUtil {
  static generateReadableStream(data) {
    return new Readable({
      objectMode: true,
      read() {
        for (const item of data) {
          this.push(item)
        }

        this.push(null)
      }
    })
  }

  static generateWriteStream(fn) {
    return new Writable({
      objectMode: true,
      write(chunck, encoding, cb) {
        fn(chunck)

        cb(null, chunck)
      }
    })
  }

  static generateTransformStream(fn) {
    return new Transform({
      objectMode: true,
      transform(chunck, enconding, cb) {
        fn(chunck)
        cb(null, chunck)
      }
    })
  }

  static getTimeFromDate(date) {
    return new Date(date).getTime()
  }

  static mockDateNow(timer) {
    const now = jest.spyOn(global.Date, global.Date.now.name)

    timer.forEach(time => {
      now.mockReturnValueOnce(time)
    })
  }
}