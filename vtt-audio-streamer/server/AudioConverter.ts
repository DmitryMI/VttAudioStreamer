import {IDependencyManager} from "#shared/IDependencyManager";
import {IAudioConverter} from "#shared/IAudioConverter";
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";
import {spawn} from "node:child_process";

export class AudioConverter implements IAudioConverter {

    constructor(dependencyManager: IDependencyManager) {
        this.dependencyManager = dependencyManager;
    }

    async convertToPcm(data: Uint8Array, sourceMimeType: string, targetPcmInfo: IPcmInfo, onProgress?: (progress: number) => void): Promise<ReadableStream<Float32Array>>{
        const ffmpegPath = "ffmpeg";

        const args = [
            "-hide_banner",
            "-loglevel repeat+level+fatal",

            // Input from stdin
            "-i", "pipe:0",

            // Output format
            "-f", "f32le",
            "-ac", String(targetPcmInfo.channels),
            "-ar", String(targetPcmInfo.sampleRate),

            // Output to stdout
            "pipe:1"
        ];

        const ffmpeg = spawn(ffmpegPath, args, {
            stdio: ["pipe", "pipe", "pipe"]
        });

        ffmpeg.stdin.write(data);
        ffmpeg.stdin.end();

        /* -------------------------------
         * Parse progress from stderr
         * ------------------------------- */
        ffmpeg.stderr.setEncoding("utf8");
        ffmpeg.stderr.on("data", chunk => {
            console.log(`[ffmpeg] ${chunk}`)
            // Example lines:
            // time=00:00:03.21 bitrate=...
            const match = /time=(\d+):(\d+):([\d.]+)/.exec(chunk);
            if (!match) return;

            const [, hh, mm, ss] = match;
            const seconds =
                Number(hh) * 3600 +
                Number(mm) * 60 +
                Number(ss);

            // You can normalize if duration is known
            if(onProgress) {
                onProgress(seconds);
            }
        });

        return new ReadableStream<Float32Array>({
            start(controller) {
                ffmpeg.stdout.on("data", (chunk: Buffer) => {
                    // Buffer → Float32Array (zero-copy)
                    const floats = new Float32Array(
                        chunk.buffer,
                        chunk.byteOffset,
                        chunk.byteLength / 4
                    );
                    controller.enqueue(floats);
                });

                ffmpeg.stdout.on("end", () => {
                    controller.close();
                });

                ffmpeg.on("error", err => {
                    controller.error(err);
                });

                ffmpeg.on("close", code => {
                    if (code !== 0) {
                        controller.error(
                            new Error(`ffmpeg exited with code ${code}`)
                        );
                    }
                });
            },

            cancel() {
                ffmpeg.kill("SIGKILL");
            }
        });
    }


    private readonly dependencyManager: IDependencyManager;
}

