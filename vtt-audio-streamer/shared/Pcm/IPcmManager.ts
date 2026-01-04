import type {IPcm, PcmId} from "#shared/Pcm/IPcm";
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export interface IPcmManager {

    init(): Promise<void>;
    getPcms(): Promise<IPcm[]>;
    createPcm(name: string, info: IPcmInfo, samples: Float32Array): Promise<IPcm>;
    findPcm(id: PcmId):  Promise<IPcm>;
    savePcm(pcm: IPcm): Promise<void>;
    getDefaultPcmInfo(): IPcmInfo;
}
