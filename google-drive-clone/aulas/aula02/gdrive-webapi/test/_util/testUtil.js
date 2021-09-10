import { Readable, Writable, Transform } from 'stream'

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
}