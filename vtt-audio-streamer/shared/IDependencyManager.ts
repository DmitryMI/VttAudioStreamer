import type {IAudioConverter} from "#shared/AudioConversion/IAudioConverter";
import type {IAudioMixer} from "#shared/IAudioMixer";
import type {IAudioImporter} from "#shared/IAudioImporter";
import type {IPcmManager} from "#shared/Pcm/IPcmManager";
import type {IPcmPersistence} from "#shared/Persistence/IPcmPersistence";

export interface IDependencyManager {
    getAudioConverter(): IAudioConverter;
    getAudioMixer(): IAudioMixer;
    getAudioImporter(): IAudioImporter;
    getPcmManager(): IPcmManager;
    getPcmPersistence(): IPcmPersistence;
}