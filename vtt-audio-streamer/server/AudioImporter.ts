import {IAudioImporter} from "#shared/IAudioImporter";
import type {PcmId} from "#shared/Pcm/IPcm";
import {IDependencyManager} from "#shared/IDependencyManager";

export class AudioImporter implements IAudioImporter {

    constructor(dependencyManager: IDependencyManager) {
        this.dependencyManager = dependencyManager;
    }

    getMaximumAudioSize(): number{
        return 100 * 1024 * 1024;
    }

    getAllowedMimes(): Set<string>{
        return new Set<string>(
            [
                "audio/aac",
                "audio/aacp",
                "audio/adpcm",
                "audio/aiff",
                "audio/x-aiff",
                "audio/basic",
                "audio/flac",
                "audio/midi",
                "audio/mp4",
                "audio/mp4a-latm",
                "audio/mpeg",
                "audio/ogg",
                "audio/opus",
                "audio/vnd.digital-winds",
                "audio/vnd.dts",
                "audio/vnd.dts.hd",
                "audio/vnd.lucent.voice",
                "audio/vnd.ms-playready.media.pya",
                "audio/vnd.nuera.ecelp4800",
                "audio/vnd.nuera.ecelp7470",
                "audio/vnd.nuera.ecelp9600",
                "audio/vnd.wav",
                "audio/wav",
                "audio/x-wav",
                "audio/vnd.wave",
                "audio/wave",
                "audio/x-pn-wav",
                "audio/webm",
                "audio/x-matroska",
                "audio/x-mpegurl",
                "audio/x-ms-wax",
                "audio/x-ms-wma",
                "audio/x-pn-realaudio",
                "audio/x-pn-realaudio-plugin"
            ]);

    }

    async processUpload(fileName: string, mimeType: string, data: Uint8Array, onProgress?: (progress: number) => void): Promise<PcmId>{
        const pcmManager = this.dependencyManager.getPcmManager();
        const audioConverter = this.dependencyManager.getAudioConverter();

        const blob = new Blob([data]);
        const stream = blob.stream();

        let convertedData = await audioConverter.convertToPcm(stream, mimeType, pcmManager.getDefaultPcmInfo(), onProgress);
        let convertedDataReader = convertedData.getReader();
        let read = await convertedDataReader.read();
        let convertedDataArray = read.value;
        if(!convertedDataArray){
            throw new Error("Could not convert data array");
        }
        return (await pcmManager.createPcm(fileName, pcmManager.getDefaultPcmInfo(), convertedDataArray)).id;
    }

    private readonly dependencyManager: IDependencyManager;
}

