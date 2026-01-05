import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export interface IAudioProbe{
    probeAudio(fileName: string, data: Uint8Array): Promise<IPcmInfo>;

}