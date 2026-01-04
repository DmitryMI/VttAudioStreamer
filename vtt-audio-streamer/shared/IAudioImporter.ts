import type {PcmId} from "#shared/Pcm/IPcm";

export interface IAudioImporter {
    getMaximumAudioSize(): number;
    getAllowedMimes(): Set<string>;

    processUpload(fileName: string, mimeType: string, data: Uint8Array, onProgress?: (progress: number) => void): Promise<PcmId>;
}
