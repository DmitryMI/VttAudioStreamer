
import {type AudioConversionSessionId, IAudioConversionSession} from "#shared/AudioConversion/IAudioConversionSession";
import type {IPcmFormat} from "#shared/Pcm/IPcmFormat";
import type {AudioConverter} from "~~/server/AudioConversion/AudioConverter";
import {type ChildProcessWithoutNullStreams, spawn} from "node:child_process";

export class AudioConversionSession implements IAudioConversionSession {
    readonly id: AudioConversionSessionId;

    constructor(id: AudioConversionSessionId, parent: AudioConverter, completionCallback: (session: IAudioConversionSession)=>void, data: Uint8Array, sourceMimeType: string, targetPcmInfo: IPcmFormat) {
        this.id = id;
        this.parent = parent;
        this.completionCallback = completionCallback;

        const ffmpegPath = "ffmpeg";

        const args = [
            "-hide_banner",
            "-loglevel", "repeat+level+info",

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

            const matchDuration = /Duration: (\d+):(\d+):([\d.]+)/.exec(chunk);
            if(matchDuration) {
                const [, hh, mm, ss] = matchDuration;
                const seconds =
                    Number(hh) * 3600 +
                    Number(mm) * 60 +
                    Number(ss);
                this.durationMs = seconds * 1000;
            }

            const matchCurrentTime = /time=(\d+):(\d+):([\d.]+)/.exec(chunk);
            if(matchCurrentTime) {

                const [, hh, mm, ss] = matchCurrentTime;
                const seconds =
                    Number(hh) * 3600 +
                    Number(mm) * 60 +
                    Number(ss);

                if(this.durationMs > 0) {
                    this.progress = seconds * 1000 / this.durationMs;
                    console.log(`[ffmpeg:log] progress=${this.progress}`);
                }
                else{
                    this.progress = 0;
                }
            }
        });

        this.ffmpeg.stdout.on("data", chunk => {
            const floatChunk = new Float32Array(chunk.buffer, chunk.byteOffset, chunk.byteLength / 4)
            this.chunks.push(floatChunk);
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
        if(!this.done){
            return null;
        }

        //get the total number of frames on the new float32array
        const nFrames = this.chunks.reduce((acc, elem) => acc + elem.length, 0)

        //create a new float32 with the correct number of frames
        const result = new Float32Array(nFrames);

        //insert each chunk into the new float32array
        let currentFrame =0
        this.chunks.forEach((chunk)=> {
            result.set(chunk, currentFrame)
            currentFrame += chunk.length;
        });
        return result;
    }

    private parent: AudioConverter;
    private readonly completionCallback: Function;
    private ffmpeg: ChildProcessWithoutNullStreams;
    private progress: number = 0;
    private done: boolean = false;
    private error: Error | null = null;
    private chunks: Float32Array[] = [];
    private durationMs: number = 0;
}
