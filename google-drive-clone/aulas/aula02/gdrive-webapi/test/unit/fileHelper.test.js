import { describe, test, expect, jest } from "@jest/globals";
import fs from 'fs'
import FileHelper from "../../src/fileHelper";

describe("#FileHelper", () => {
  describe("#getFileStatus", () => {
    test('it should return files statuses in correct format', async () => {
      const statMock = {
        dev: 2,
        mode: 33188,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 512,
        ino: 1688849862887750,
        size: 67298,
        blocks: 136,
        atimeMs: 1630965086381.5571,
        mtimeMs: 1630965086382.5564,
        ctimeMs: 1630965086383.5557,
        birthtimeMs: 1630965086383.5557,
        atime: '2021-09-06T21:51:26.382Z',
        mtime: '2021-09-06T21:51:26.383Z',
        ctime: '2021-09-06T21:51:26.384Z',
        birthtime: '2021-09-06T21:51:26.384Z'
      }

      const mockUser = 'igorbecker'
      const fileName = 'file.png'
      process.env.USER = mockUser

      jest.spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock)

      jest.spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([fileName])

      const result = await FileHelper.getFileStatus('/tmp')

      const expectResult = [
        {
          size: '67.3 kB',
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: fileName,
        }
      ]

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${fileName}`)
      expect(result).toMatchObject(expectResult)
    })
  })
})