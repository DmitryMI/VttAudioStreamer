import type {IPcm} from "#shared/Pcm/IPcm";
import type {AudioSampleId, IAudioSample} from "#shared/IAudioSample";

/**
 * Permanently stores uploaded files
 */
export interface IAudioSamplePersistence {

    createAudioSample(name: string, pcm: IPcm): Promise<IAudioSample>;
    saveAudioSample(sample: IAudioSample): Promise<void>;
    loadAudioSample(id: AudioSampleId) : Promise<IAudioSample>
    getAllAudioSamples(): Promise<IAudioSample[]>;
}