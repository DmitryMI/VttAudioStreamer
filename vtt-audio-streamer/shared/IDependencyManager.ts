import type {IAudioConverter} from "#shared/AudioConversion/IAudioConverter";
import type {IAudioMixer} from "#shared/IAudioMixer";
import type {IAudioImporter} from "#shared/AudioImporting/IAudioImporter";
import type {IPcmManager} from "#shared/Pcm/IPcmManager";
import type {IPcmPersistence} from "#shared/Persistence/IPcmPersistence";
import type {IAudioProbe} from "#shared/IAudioProbe";

export interface IDependencyManager {
    getAudioConverter(): IAudioConverter;
    getAudioMixer(): IAudioMixer;
    getAudioImporter(): IAudioImporter;
    getAudioProbe(): IAudioProbe;
    getPcmManager(): IPcmManager;
    getPcmPersistence(): IPcmPersistence;
}