import type {IPcm, PcmId} from "#shared/Pcm/IPcm";
import type {IPcmFormat} from "#shared/Pcm/IPcmFormat";
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export interface IPcmManager {

    init(): Promise<void>;
    getPcms(): Promise<IPcm[]>;
    createPcm(name: string, format: IPcmFormat, info: IPcmInfo, samples: Float32Array): Promise<IPcm>;
    findPcm(id: PcmId):  Promise<IPcm>;
    savePcm(pcm: IPcm): Promise<void>;
    getDefaultPcmFormat(): IPcmFormat;
}
