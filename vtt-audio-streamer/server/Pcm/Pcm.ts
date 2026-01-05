import {IPcm, PcmId} from "#shared/Pcm/IPcm";
import {IPcmFormat} from "#shared/Pcm/IPcmFormat";
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export class Pcm implements IPcm {
    public id: PcmId;
    public name: string;
    public info: IPcmInfo;
    public format: IPcmFormat;
    public startMs: number;
    public durationMs: number;

    constructor(id: PcmId, name:string, format: IPcmFormat, info: IPcmInfo, startMs: number, durationMs: number, pcmSamples: Float32Array) {
        this.id = id;
        this.name = name;
        this.format = format;
        this.info = info;
        this.startMs = startMs;
        this.durationMs = durationMs;
        this.pcmSamples = pcmSamples;

        // FIXME This is a hack to fix duration being 0 due to ffprobe limitations.
        if(this.info.durationMs == 0 || isNaN(this.info.durationMs)){
            this.info.durationMs = durationMs;
        }
    }

    getFullTrackSamples(): Float32Array {
        return this.pcmSamples;
    }

    /**
     * Returns IPcm instance representing the whole track.
     */
    getFullTrack(): IPcm{
        return new Pcm(this.id, name, this.format, this.info, 0, this.getFullTrackDurationMs(), this.pcmSamples)
    }

    /**
     * Return IPcm instance representing a sub-fragment of this PCM fragment.
     * @param startOffsetMs - sub-fragment start offset in ms
     * @param durationMs - sub-fragment duration in ms
     */
    getFragment(startOffsetMs: number, durationMs: number): IPcm{
        return new Pcm(this.id, name, this.format, this.info, this.startMs + startOffsetMs, durationMs, this.pcmSamples)
    }

    /**
     * Returns PCM samples as array of Float32.
     */
    getSamples(): Float32Array{
        const firstSampleIndex = this.startMs * this.format.sampleRate * this.format.channels;
        let samplesNum = this.durationMs * this.format.sampleRate * this.format.channels;
        if(samplesNum >= this.pcmSamples.length){
            samplesNum = this.pcmSamples.length;
        }

        let subArray = new Float32Array(samplesNum);

        for(let i = firstSampleIndex; i <= samplesNum; ++i) {
            subArray[i - firstSampleIndex] = this.pcmSamples[i];
        }

        return subArray;
    }

    setFullTrackSamples(pcmSamples: Float32Array): void{
        this.pcmSamples = pcmSamples;
    }

    getFullTrackDurationMs(): number{
        return Pcm.calculateDurationMs(this.pcmSamples.length, this.format);
    }

    static calculateDurationMs(samplesNum: number, format: IPcmFormat){
        return samplesNum / format.sampleRate / format.channels * 1000;
    }

    private pcmSamples: Float32Array;
}