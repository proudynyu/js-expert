import VideoProcessor from "./videoProcessor"
import Mp4Demuxer from "./mp4-demuxer"

const qvgaConstraints = {
    width: 320,
    height: 249,
}

const vgaConstraints = {
    width: 640,
    height: 480
}

const hdConstraints = {
    width: 1280,
    height: 729
}

const encoderConfig = {
    ...qvgaConstraints,
    bitrate: 10e6,
    // WebM
    coder: "vp09.00.10.08",
    pt: 4,
    hardwareAcceleration: "prefer-software",
    // mp4
    // codec: "avc1.42002A",
    // pt: 1,
    // hardwareAcceleration: "prefer-hardware",
    // avc: {
    //     format: "annexb"
    // }
}

const mp4Demuxer = new Mp4Demuxer()
const videoProcessor = new VideoProcessor({ mp4Box: mp4Demuxer })

onmessage = async ({ data }) => {
    await videoProcessor.start({
        file: data.file,
        encoderConfig,
        sendMessage(message) {
            self.postMessage(message)
        }
    })
}
