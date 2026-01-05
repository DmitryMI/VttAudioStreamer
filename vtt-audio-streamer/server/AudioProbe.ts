import {IAudioProbe} from "#shared/IAudioProbe";
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";
import type {PcmInfo} from "~~/server/Pcm/PcmInfo";
import {spawn} from "node:child_process";

export class AudioProbe implements IAudioProbe {
    probeAudio(fileName: string, data: Uint8Array): Promise<IPcmInfo>{
        return new Promise<PcmInfo>((resolve, reject) => {

            const ffprobe = spawn("ffprobe", [
                "-hide_banner",
                "-loglevel", "quiet",
                "-print_format", "json",
                "-show_format",
                "-i", "pipe:0"
            ], {
                stdio: ["pipe", "pipe", "pipe"]
            })

            const stdoutChunks: Buffer[] = []
            const stderrChunks: Buffer[] = []

            ffprobe.stdout.on("data", chunk => stdoutChunks.push(chunk))
            ffprobe.stderr.on("data", chunk => stderrChunks.push(chunk))

            ffprobe.on("error", err => reject(err))

            ffprobe.on("close", code => {
                if (code !== 0) {
                    return reject(
                        new Error(`ffprobe failed: ${Buffer.concat(stderrChunks).toString("utf8")}`)
                    )
                }

                try {
                    const text = Buffer.concat(stdoutChunks).toString("utf8")
                    const json = JSON.parse(text)

                    const format = json.format ?? {}
                    const tags = format.tags ?? {}

                    const durationSec = format.duration
                    const bitrate = Number(format.bit_rate ?? 0)

                    const info: PcmInfo = {
                        fileName,
                        durationMs: Math.round(durationSec * 1000),
                        bitrate,

                        album: tags.album,
                        artist: tags.artist,
                        date: tags.date ?? tags.year,
                        title: tags.title
                    }

                    resolve(info)
                } catch (err) {
                    reject(err)
                }
            })

            // Write audio blob to stdin
            ffprobe.stdin.write(Buffer.from(data))
            ffprobe.stdin.end()
        })
    }
}