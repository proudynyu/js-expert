import {createFile} from "../deps/mp4box.0.5.2"

export default class Mp4Demuxer {
    #onConfig
    #onChunck
    #file

    /**
        * @param {ReadableStream} stream
        * @param {object} options
        * @param {(config: object) => void} options.onConfig
        */
    async run(stream, { onConfig, onChunck }) {
        this.#onConfig = onConfig
        this.#onChunk = onChunck
        this.#file = createFile()

        this.#file.onReady = (args) => {
        }

        this.#file.onError = (error) => {
            console.error("deu ruim", error)
        }

        this.#init(stream)
    }

    #init(stream) {
        new WritableStream
    }
}
