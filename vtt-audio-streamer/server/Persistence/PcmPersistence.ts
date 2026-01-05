import {IPcmPersistence} from "#shared/Persistence/IPcmPersistence";
import type {IPcm, PcmId} from "#shared/Pcm/IPcm";
import { useStorage } from '#imports';

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
        let name = await storage.getItem<string>(`${pcm.id}:name`);
        if (!name) {
            throw new Error(`Could not load PCM with id ${pcm.id}.`);
        }
        pcm.name = name;

        let sampleRate = await storage.getItem<number>(`${pcm.id}:sampleRate`);
        if (!sampleRate) {
            throw new Error(`Could not load PCM with id ${pcm.id}`);
        }
        pcm.pcmInfo.sampleRate = sampleRate;

        let channels = await storage.getItem<number>(`${pcm.id}:channels`);
        if (!channels) {
            throw new Error(`Could not load PCM with id ${pcm.id}`);
        }
        pcm.pcmInfo.channels = channels;

        let samples = await storage.getItemRaw<Float32Array>(`${pcm.id}:samples`);
        if (!samples) {
            throw new Error(`Could not load PCM with id ${pcm.id}`);
        }
        pcm.setFullTrackSamples(samples);
    }

    async savePcm(pcm: IPcm): Promise<void>{
        const storage = useStorage("pcm");
        await storage.setItem(`${pcm.id}:name`, pcm.name);
        await storage.setItem(`${pcm.id}:sampleRate`, pcm.pcmInfo.sampleRate);
        await storage.setItem(`${pcm.id}:channels`, pcm.pcmInfo.channels);
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

        await storage.removeItem(`${pcmId}:name`);
        await storage.removeItem(`${pcmId}:sampleRate`);
        await storage.removeItem(`${pcmId}:channels`);
        await storage.removeItem(`${pcmId}:samples`);
    }
}