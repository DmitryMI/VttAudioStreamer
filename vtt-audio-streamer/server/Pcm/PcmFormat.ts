import {IPcmFormat} from "#shared/Pcm/IPcmFormat";

export class PcmFormat implements IPcmFormat {
    public sampleRate: number;

    public channels: number;

    constructor(sampleRate: number, channels: number) {
        this.sampleRate = sampleRate;
        this.channels = channels;
    }
}