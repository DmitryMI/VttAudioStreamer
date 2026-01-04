import {IPcm, PcmId} from "#shared/Pcm/IPcm";
import {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export class Pcm implements IPcm {
    public id: PcmId;
    public name: string;
    public pcmInfo: IPcmInfo;
    public startMs: number;
    public durationMs: number;

    constructor(id: PcmId, name:string, info: IPcmInfo, startMs: number, durationMs: number, pcmSamples: Float32Array) {
        this.id = id;
        this.name = name;
        this.pcmInfo = info;
        this.startMs = startMs;
        this.durationMs = durationMs;
        this.pcmSamples = pcmSamples;
    }

    getFullTrackSamples(): Float32Array {
        return this.pcmSamples;
    }

    /**
     * Returns IPcm instance representing the whole track.
     */
    getFullTrack(): IPcm{
        return new Pcm(this.id, name, this.pcmInfo, 0, this.getFullTrackDurationMs(), this.pcmSamples)
    }

    /**
     * Return IPcm instance representing a sub-fragment of this PCM fragment.
     * @param startOffsetMs - sub-fragment start offset in ms
     * @param durationMs - sub-fragment duration in ms
     */
    getFragment(startOffsetMs: number, durationMs: number): IPcm{
        return new Pcm(this.id, name, this.pcmInfo, this.startMs + startOffsetMs, durationMs, this.pcmSamples)
    }

    /**
     * Returns PCM samples as array of Float32.
     */
    getSamples(): Float32Array{
        const firstSampleIndex = this.startMs * this.pcmInfo.sampleRate * this.pcmInfo.channels;
        const samplesNum = this.durationMs * this.pcmInfo.sampleRate * this.pcmInfo.channels;
        console.assert(samplesNum <= this.pcmSamples.length);
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
        return Pcm.calculateDurationMs(this.pcmSamples.length,this.pcmInfo);
    }

    static calculateDurationMs(samplesNum: number, pcmInfo: IPcmInfo){
        return samplesNum / pcmInfo.sampleRate / pcmInfo.channels * 1000;
    }

    private pcmSamples: Float32Array;
}