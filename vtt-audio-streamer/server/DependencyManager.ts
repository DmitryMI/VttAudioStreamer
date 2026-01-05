import type {IDependencyManager} from "#shared/IDependencyManager";
import type {IAudioConverter} from "#shared/IAudioConverter";
import type {IAudioMixer} from "#shared/IAudioMixer";
import type {IAudioImporter} from "#shared/IAudioImporter";
import type{IPcmManager} from "#shared/Pcm/IPcmManager";
import  type{IPcmPersistence} from "#shared/Persistence/IPcmPersistence";
import {PcmPersistence} from "~~/server/Persistence/PcmPersistence";
import {PcmManager} from "~~/server/Pcm/PcmManager";
import {AudioImporter} from "~~/server/AudioImporter";
import {AudioConverter} from "~~/server/AudioConverter";

export class DependencyManager implements IDependencyManager {

    constructor() {
        this.pcmPersistence = new PcmPersistence();
        this.pcmManager = new PcmManager(this);
        this.audioImporter = new AudioImporter(this);
        this.audioConverter = new AudioConverter(this);
    }

    getAudioConverter(): IAudioConverter{
        return this.audioConverter;
    }

    getAudioMixer(): IAudioMixer{
        if(!this.audioMixer){
            throw Error("Not implemented");
        }
        return this.audioMixer;
    }

    getAudioImporter(): IAudioImporter{
        return this.audioImporter;
    }

    getPcmManager(): IPcmManager{
        return this.pcmManager;
    }

    getPcmPersistence(): IPcmPersistence{
        return this.pcmPersistence;
    }

    private readonly audioMixer?: IAudioMixer;
    private readonly audioConverter: IAudioConverter;
    private readonly audioImporter: IAudioImporter;

    private readonly pcmManager: IPcmManager;
    private readonly pcmPersistence: IPcmPersistence;
}

const dependencyManager: DependencyManager = new DependencyManager();

export function getDependencyManager(): IDependencyManager{
    return dependencyManager;
}

