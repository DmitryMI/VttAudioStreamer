import type {IPcm} from "#shared/Pcm/IPcm";

export type AudioSampleId = string & { readonly __brand: "AudioSampleId" };

/**
 * Imported and trimmed audio file.
 */
export interface IAudioSample {
    id: AudioSampleId;
    name: string;

    pcm: IPcm
}