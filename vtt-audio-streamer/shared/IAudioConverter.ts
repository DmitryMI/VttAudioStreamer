import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";

/**
 * Permanently stores uploaded files
 */
export interface IAudioConverter {

    convertToPcm(data: Uint8Array, sourceMimeType: string, targetPcmInfo: IPcmInfo, onProgress?: (progress: number) => void): Promise<ReadableStream<Float32Array>>;

}