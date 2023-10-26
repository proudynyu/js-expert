export default class VideoProcessor {
    #mp4Box

    /**
      * @param {object} options
      * @param {import("./mp4Demuxer.js").default} options.mp4Box
      */
    constructor({ mp4Box }) {
        this.#mp4Box = mp4Box
    }

    async mp4Decoder(encoderConfig, stream) {
        this.#mp4Box.run(stream, {
            onConfig(config) {
                debugger
            },
            onChunk(chuck) {
                debugger
            }
        })
    }

    async start({ file, encoderConfig, sendMessage }) {
        const stream = file.stream()
        const filename = file.name.split('/').pop().replace(".mp4", "")

        await this.mp4Decoder(encoderConfig, stream)
    }
}
