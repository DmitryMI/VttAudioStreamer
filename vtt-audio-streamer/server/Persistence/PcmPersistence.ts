import {IPcmPersistence} from "#shared/Persistence/IPcmPersistence";
import type {IPcm, PcmId} from "#shared/Pcm/IPcm";
import { useStorage } from '#imports';
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";
import type {IPcmFormat} from "#shared/Pcm/IPcmFormat";

class PcmMetadata{
    name: string
    info: IPcmInfo
    format: IPcmFormat

    constructor(name:string, info: IPcmInfo, format: IPcmFormat) {
        this.name = name;
        this.info = info;
        this.format = format;
    }
}


export class PcmPersistence implements IPcmPersistence {

    constructor() {

    }

    async getSavedPcmIds(): Promise<PcmId[]>{
        const storage = useStorage("pcm");
        let keys = await storage.getItem<string>("ids");
        if (!keys) {
            return [];
        }
        let result: PcmId[] = [];
        for (const key of keys) {
            result.push(key as PcmId);
        }
        return result;
    }

    async loadPcm(pcm: IPcm): Promise<void>{
        const storage = useStorage("pcm");

        let metadata: PcmMetadata | null = await storage.getItem<PcmMetadata>(`${pcm.id}:metadata`);
        if (!metadata) {
            throw new Error(`Could not load PCM with id ${pcm.id}.`);
        }
        pcm.name = metadata.name;
        pcm.format = metadata.format;
        pcm.info = metadata.info;

        let samples = await storage.getItemRaw<Float32Array>(`${pcm.id}:samples`);
        if (!samples) {
            throw new Error(`Could not load PCM with id ${pcm.id}`);
        }
        pcm.setFullTrackSamples(samples);
    }

    async savePcm(pcm: IPcm): Promise<void>{
        const storage = useStorage("pcm");
        await storage.setItem(`${pcm.id}:metadata`,
            {
                name: pcm.name,
                info: pcm.info,
                format: pcm.format
            }
        );
        await storage.setItemRaw(`${pcm.id}:samples`, pcm.getSamples());

        let keys = await storage.getItem<PcmId[]>("ids");
        if (!keys) {
            keys = [pcm.id];
        }

        if(keys.indexOf(pcm.id) === -1) {
            keys.push(pcm.id);
        }

        await storage.setItem(`ids`, keys);
    }

    async deletePcm(pcmId: PcmId): Promise<void>{
        const storage = useStorage("pcm");
        let keys = await storage.getItem<PcmId[]>("ids");
        if (!keys) {
            throw new Error("No PCM stored")
        }

        const index = keys.indexOf(pcmId);
        if(index === -1) {
            throw new Error("Tried to remove non-existent pcm");
        }

        keys.splice(index, 1);
        await storage.setItem(`ids`, keys);

        await storage.removeItem(`${pcmId}:metadata`);
        await storage.removeItem(`${pcmId}:samples`);
    }
}