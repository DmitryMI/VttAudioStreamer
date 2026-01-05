import {IPcm, PcmId} from "#shared/Pcm/IPcm";
import {IPcmManager} from "#shared/Pcm/IPcmManager";
import type {IPcmFormat} from "#shared/Pcm/IPcmFormat";
import {IDependencyManager} from "#shared/IDependencyManager";
import {Pcm} from "~~/server/Pcm/Pcm";
import {PcmFormat} from "~~/server/Pcm/PcmFormat";
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";
import {PcmInfo} from "~~/server/Pcm/PcmInfo";

export class PcmManager implements IPcmManager {

    constructor(dependencyManager: IDependencyManager) {
        this.dependencyManager = dependencyManager;
        this.pcmEntries = [];
    }

    async getPcms(): Promise<IPcm[]>{
        if(!this.initComplete){
            throw new Error("init() must be called before using PcmManager");
        }
        return this.pcmEntries;
    }

    async createPcm(name: string, format: IPcmFormat,  info: IPcmInfo, samples: Float32Array): Promise<IPcm>{
        if(!this.initComplete){
            throw new Error("init() must be called before using PcmManager");
        }

        let id: PcmId = crypto.randomUUID() as PcmId;
        const durationMs = Pcm.calculateDurationMs(samples.length, format);
        let pcm: Pcm = new Pcm(id, name, format, info,0, durationMs, samples);
        this.pcmEntries.push(pcm);
        await this.savePcm(pcm);
        console.log(`Created Pcm: ${pcm.id} from ${samples.length} samples`);
        return pcm;
    }

    async findPcm(id: PcmId): Promise<IPcm>{
        if(!this.initComplete){
            throw new Error("init() must be called before using PcmManager");
        }

        for(let pcm of this.pcmEntries) {
            if(pcm.id == id){
                return pcm;
            }
        }
        throw new Error(`PCM with id ${id} not found`);
    }

    async savePcm(pcm: IPcm): Promise<void>{
        if(!this.initComplete){
            throw new Error("init() must be called before using PcmManager");
        }

        const persistence = this.dependencyManager.getPcmPersistence();
        await persistence.savePcm(pcm);
    }

    async init(): Promise<void> {
        let entries = [];
        const persistence = this.dependencyManager.getPcmPersistence();
        const ids = await persistence.getSavedPcmIds();
        for(const pcmId of ids){
            let pcm: Pcm = new Pcm(pcmId, "", new PcmFormat(0, 0), new PcmInfo("", 0, 0), 0, 0, new Float32Array(0));
            await persistence.loadPcm(pcm);
            pcm.durationMs = Pcm.calculateDurationMs(pcm.getFullTrackSamples().length, pcm.format);
            entries.push(pcm);
        }
        this.pcmEntries = entries;
        this.initComplete = true;
    }

    getDefaultPcmFormat(): IPcmFormat{
        if(!this.initComplete){
            throw new Error("init() must be called before using PcmManager");
        }

        return new PcmFormat(44100, 2);
    }

    private readonly dependencyManager: IDependencyManager;
    private initComplete: boolean = false;
    private pcmEntries: Pcm[];
}