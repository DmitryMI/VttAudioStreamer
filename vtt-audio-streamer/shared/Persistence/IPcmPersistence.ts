import type {IPcm, PcmId} from "#shared/Pcm/IPcm";

export interface IPcmPersistence {

    getSavedPcmIds(): Promise<PcmId[]>;
    loadPcm(pcm: IPcm): Promise<void>;
    savePcm(pcm: IPcm): Promise<void>;
    deletePcm(pcmId: PcmId): Promise<void>;
}