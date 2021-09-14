import {
  describe,
  test,
  jest,
  beforeAll,
  afterAll,
  expect,
} from "@jest/globals";
import fs from "fs";
import FileHelper from "../../src/fileHelper.js";

import Routes from "../../src/routes.js";
import FormData from "form-data";
import TestUtil from "../_util/testUtil.js";
import { logger } from "../../src/logger.js";
import { tmpdir } from "os";
import { join } from "path";

describe("#Routes Integration Test", () => {
  let defaultDownloadsFolder = "";

  beforeAll(async () => {
    defaultDownloadsFolder = await fs.promises.mkdtemp(
      join(tmpdir(), "downloads-")
    );
  });

  afterAll(async () => {
    await fs.promises.rm(defaultDownloadsFolder, { recursive: true });
  });

  describe("#getFileStatus", () => {
    const ioObj = {
      io: (id) => ioObj,
      emit: (event, message) => {}
    }

    test('should upload file to the folder', async() => {
      const filename = 'semanajsexpert.png'
      const fileStream = fs.createReadStream(`./test/integration/mocks/${filename}`)
      const response = TestUtil.generateWriteStream(() => {})

      const form = new FormData()
      form.append('photo', fileStream)

      const defaultParams = {
        request: Object.assign(form, {
          headers: form.getHeaders(),
          method: 'POST',
          url: '?sockedId=10'
        }),
        response: Object.assign(response, {
          setHeader: jest.fn(),
          writeHead: jest.fn(),
          end: jest.fn()
        }),
        values: () => Object.values(defaultParams)
      }

      const routes = new Routes(defaultDownloadsFolder)
      routes.setSocketInstace(ioObj)

      const dirBeforeRun = await fs.promises.readdir(defaultDownloadsFolder)
      expect(dirBeforeRun).toEqual([])

      await routes.handler(...defaultParams.values())

      const dirAfterRun = await fs.promises.readdir(defaultDownloadsFolder)
      expect(dirAfterRun).toEqual([filename])

      expect(defaultParams.response.writeHead).toHaveBeenCalledWith(200)

      const expectResult = JSON.stringify({ result: 'Files uploaded with success!' })
      expect(defaultParams.response.end).toHaveBeenCalledWith(expectResult)
    })
  })
});
