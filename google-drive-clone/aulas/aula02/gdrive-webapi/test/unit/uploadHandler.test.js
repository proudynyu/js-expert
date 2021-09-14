import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import fs from 'fs'
import { resolve } from "path";
import { pipeline } from "stream/promises";
import { logger } from "../../src/logger.js";
import UploadHandler from "../../src/uploadHandler.js";
import TestUtil from "../_util/testUtil.js";

describe('#UploadHandler test suite', () => {
  const ioObject = {
    to: (id) => ioObject,
    emit: (event, message) => {},
  };

  beforeEach(() => {
    jest.spyOn(logger, 'info')
      .mockImplementation()
  })

  describe('#registerEvents', () => {
    test('should call onFile and onFinish functions on Busboy instance', () => {
      const uploadHandler = new UploadHandler({
        io: ioObject,
        sockedId: '01'
      })

      jest.spyOn(uploadHandler, uploadHandler.onFile.name)
        .mockResolvedValue()

      const headers = {
        'content-type': 'multipart/form-data; boundary='
      }

      const onFinish = jest.fn()

      const busboyInstance = uploadHandler.registerEvents(headers, onFinish)

      const fileStream = TestUtil.generateReadableStream(['chunck', 'of', 'data'])
      busboyInstance.emit('file', 'fieldName', fileStream, 'filename.txt')

      busboyInstance.listeners('finish')[0].call()

      expect(uploadHandler.onFile).toHaveBeenCalled()
      expect(onFinish).toHaveBeenCalled()
    })
  })

  describe("#onFile", () => {
    test('given a stream file it should save it on disk', async() => {
      const chuncks = ['chunck', 'stream']
      const downloadsFolder = '/tmp'
      const handler = new UploadHandler({
        io: ioObject,
        sockedId: '01',
        downloadsFolder: downloadsFolder
      })
      
      const onData = jest.fn()
      jest.spyOn(fs, fs.createWriteStream.name)
        .mockImplementation(() => TestUtil.generateWriteStream(onData))

      const onTransform = jest.fn()
      jest.spyOn(handler, handler.handleFileBuffer.name)
        .mockImplementation(() => TestUtil.generateTransformStream(onTransform))

      const params = {
        fieldName: 'video',
        file: TestUtil.generateReadableStream(chuncks),
        fileName: 'mockfile.mock'
      }

      await handler.onFile(...Object.values(params))

      expect(onData.mock.calls.join()).toEqual(chuncks.join())
      expect(onTransform.mock.calls.join()).toEqual(chuncks.join())
      
      const expectedFileName = resolve(handler.downloadsFolder, params.fileName)
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFileName)
    })

  })

  describe("#handleFileBuffer", () => {
    test("should call emit funcioton and it is a transform stream", async() => {
      jest.spyOn(ioObject, ioObject.to.name)
      jest.spyOn(ioObject, ioObject.emit.name)
      

      const handler = new UploadHandler({
        io: ioObject, 
        sockedId: '01',
        downloadsFolder: '/tmp'
      })

      jest.spyOn(handler, handler.canExecute.name)
        .mockReturnValueOnce(true)

      const messages = ['hello']
      const source = TestUtil.generateReadableStream(messages)
      const onWrite = jest.fn()
      const target = TestUtil.generateWriteStream(onWrite)

      await pipeline(
        source,
        handler.handleFileBuffer('filename.txt'),
        target
      )

      expect(ioObject.to).toHaveBeenCalledTimes(messages.length)
      expect(ioObject.emit).toHaveBeenCalledTimes(messages.length)
      expect(onWrite).toHaveBeenCalledTimes(messages.length)
      expect(onWrite.mock.calls.join()).toEqual(messages.join())
    })
  })

  describe('#canExecute', () => {
    test('should return true when time is later than specified delay', () => {
      const timerDelay = 1000
      const uploadHandler = new UploadHandler({
        io: {},
        sockedId: '',
        messageTimeDelay: timerDelay
      })

      const tickNow = TestUtil.getTimeFromDate('2021-07-01 00:00:03')
      TestUtil.mockDateNow([tickNow])

      const lastExecution = TestUtil.getTimeFromDate('2021-07-01 00:00:00')

      const result = uploadHandler.canExecute(lastExecution)
      expect(result).toBeTruthy()
    })

    test('should return false when time isn\'t than specified delay', () => {
      const timerDelay = 3000
      const uploadHandler = new UploadHandler({
        io: {},
        sockedId: '',
        messageTimeDelay: timerDelay
      })

      const tickNow = TestUtil.getTimeFromDate('2021-07-01 00:00:03')
      TestUtil.mockDateNow([tickNow])

      const lastExecution = TestUtil.getTimeFromDate('2021-07-01 00:00:02')

      const result = uploadHandler.canExecute(lastExecution)
      expect(result).toBeFalsy()
    })
  })
})