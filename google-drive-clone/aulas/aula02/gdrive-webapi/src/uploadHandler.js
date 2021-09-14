import Busboy from "busboy";
import { pipeline } from "stream/promises";
import fs from "fs";
import { logger } from "./logger.js";

export default class UploadHandler {
  constructor({ io, sockedId, downloadsFolder, messageTimeDelay = 200 }) {
    this.io = io;
    this.sockedId = sockedId;
    this.downloadsFolder = downloadsFolder;
    this.ON_UPLOAD_EVENT = "file-upload";
    this.messageTimeDelay = messageTimeDelay;
  }

  canExecute(lastExecution) {
    return Date.now() - lastExecution >= this.messageTimeDelay;
  }

  handleFileBuffer(fileName) {
    this.lastMessageSent = Date.now();

    async function* handleData(source) {
      let processedAlready = 0;

      for await (const chunck of source) {
        yield chunck;

        processedAlready += chunck.length;

        if (!this.canExecute(this.lastMessageSent)) {
          continue;
        }

        this.io
          .to(this.sockedId)
          .emit(this.onUploadEvent, { processedAlready, fileName });

        logger.info(
          `File [${fileName}] gpt ${processedAlready} bytes on ${this.sockedId}`
        );
      }
    }

    return handleData.bind(this);
  }

  async onFile(fieldName, file, fileName) {
    const saveTo = `${this.downloadsFolder}/${fileName}`;
    await pipeline(
      file,
      this.handleFileBuffer.apply(this, [fileName]),
      fs.createWriteStream(saveTo)
    );

    logger.info(`File [${fileName}] finished`);
  }

  registerEvents(headers, onFinish) {
    const busboy = new Busboy({ headers });
    busboy.on("file", this.onFile.bind(this));
    busboy.on("finish", onFinish);

    return busboy;
  }
}
