import {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export class PcmInfo implements IPcmInfo {
    public sampleRate: number;

    public channels: number;

    constructor(sampleRate: number, channels: number) {
        this.sampleRate = sampleRate;
        this.channels = channels;
    }
}