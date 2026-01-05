
import {type AudioConversionSessionId, IAudioConversionSession} from "#shared/AudioConversion/IAudioConversionSession";
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";
import type {AudioConverter} from "~~/server/AudioConversion/AudioConverter";
import {type ChildProcessWithoutNullStreams, spawn} from "node:child_process";

export class AudioConversionSession implements IAudioConversionSession {
    readonly id: AudioConversionSessionId;

    constructor(id: AudioConversionSessionId, parent: AudioConverter, completionCallback: (session: IAudioConversionSession)=>void, data: Uint8Array, sourceMimeType: string, targetPcmInfo: IPcmInfo) {
        this.id = id;
        this.parent = parent;
        this.completionCallback = completionCallback;

        const ffmpegPath = "ffmpeg";

        const args = [
            "-hide_banner",
            "-loglevel", "repeat+level+verbose",

            // Input from stdin
            "-i", "pipe:0",

            // Output format
            "-f", "f32le",
            "-ac", String(targetPcmInfo.channels),
            "-ar", String(targetPcmInfo.sampleRate),

            // Output to stdout
            "pipe:1"
        ];

        this.ffmpeg = spawn(ffmpegPath, args, {
            stdio: ["pipe", "pipe", "pipe"]
        });

        this.ffmpeg.stdin.write(data);
        this.ffmpeg.stdin.end();

        this.ffmpeg.stderr.setEncoding("utf8");
        this.ffmpeg.stderr.on("data", chunk => {
            console.log(`[ffmpeg:log] ${chunk}`)
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
            this.progress = seconds;
        });

        this.ffmpeg.stdout.on("data", chunk => {
            console.log(`[ffmpeg:data] got ${chunk.byteLength} bytes`);
            if (!this.result) this.result = new Float32Array(0)
            const floatChunk = new Float32Array(chunk.buffer, chunk.byteOffset, chunk.byteLength / 4)
            const tmp = new Float32Array(this.result.length + floatChunk.length)
            tmp.set(this.result, 0)
            tmp.set(floatChunk, this.result.length)
            this.result = tmp
        })

        this.ffmpeg.on("exit", (code, signal) => {
            this.done = true;
            if(code != 0) {
                this.error = new Error(`FFmpeg exited with code ${code}, signal ${signal}`)
            }
            this.completionCallback?.(this);
            this.parent.reportSessionFinished(this);
        })
    }


    cancel(): void{

    }

    getError(): Error | null{
        return this.error;
    }

    getProgress(): number{
        return this.progress;
    }

    isDone(): boolean{
        return this.done;
    }

    getResult(): Float32Array | null{
        return this.result;
    }

    private parent: AudioConverter;
    private readonly completionCallback: Function;
    private ffmpeg: ChildProcessWithoutNullStreams;
    private progress: number = 0;
    private done: boolean = false;
    private error: Error | null = null;
    private result: Float32Array | null = null;
}
