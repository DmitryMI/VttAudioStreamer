import type {IDependencyManager} from "#shared/IDependencyManager";
import type {IAudioConverter} from "#shared/AudioConversion/IAudioConverter";
import type {IAudioMixer} from "#shared/IAudioMixer";
import type {IAudioImporter} from "#shared/AudioImporting/IAudioImporter";
import type{IPcmManager} from "#shared/Pcm/IPcmManager";
import  type{IPcmPersistence} from "#shared/Persistence/IPcmPersistence";
import {PcmPersistence} from "~~/server/Persistence/PcmPersistence";
import {PcmManager} from "~~/server/Pcm/PcmManager";
import {AudioImporter} from "~~/server/AudioImporting/AudioImporter";
import {AudioConverter} from "~~/server/AudioConversion/AudioConverter";
import type {IAudioProbe} from "#shared/IAudioProbe";
import {AudioProbe} from "~~/server/AudioProbe";

export class DependencyManager implements IDependencyManager {

    constructor() {
        this.pcmPersistence = new PcmPersistence();
        this.pcmManager = new PcmManager(this);
        this.audioImporter = new AudioImporter(this);
        this.audioConverter = new AudioConverter(this);
        this.audioProbe = new AudioProbe();
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

    getAudioProbe(): IAudioProbe{
        return this.audioProbe;
    }

    private readonly audioMixer?: IAudioMixer;
    private readonly audioConverter: IAudioConverter;
    private readonly audioImporter: IAudioImporter;
    private readonly audioProbe: IAudioProbe;

    private readonly pcmManager: IPcmManager;
    private readonly pcmPersistence: IPcmPersistence;

}

let initComplete = false;
const dependencyManager: DependencyManager = new DependencyManager();

export async function getDependencyManager(): Promise<IDependencyManager>{
    if(!initComplete){
        await dependencyManager.getPcmManager().init();
        initComplete = true;
    }
    return dependencyManager;
}

