import {AudioImportingSessionId, IAudioImportingSession} from "#shared/AudioImporting/IAudioImportingSession";
import type {AudioImporter} from "~~/server/AudioImporting/AudioImporter";
import type {IPcm, PcmId} from "#shared/Pcm/IPcm";
import type {IDependencyManager} from "#shared/IDependencyManager";
import type {IAudioConversionSession} from "#shared/AudioConversion/IAudioConversionSession";
import type {PcmInfo} from "~~/server/Pcm/PcmInfo";
import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export class AudioImportingSession implements IAudioImportingSession {
    readonly id: AudioImportingSessionId;
    readonly fileName: string;

    constructor(id: AudioImportingSessionId, parent: AudioImporter, fileName: string, mimeType: string, data: Uint8Array, dependencyManager: IDependencyManager) {
        this.id = id;
        this.parent = parent;
        this.fileName = fileName;
        this.dependencyManager = dependencyManager;

        const pcmManager = this.dependencyManager.getPcmManager();
        const audioConverter = this.dependencyManager.getAudioConverter();

        this.audioConversionSession = audioConverter.createPcmConversionSession(data, mimeType, pcmManager.getDefaultPcmFormat(), async (session) => {

            this.error = session.getError();
            if (this.error) {
                return;
            }

            const pcmSamples = session.getResult();
            if (!pcmSamples) {
                throw new Error("session.getResult() returns null but does not report an error");
            }

            const pcmInfo: PcmInfo = await this.extractPcmInfoFromAudioBlob(data, fileName);
            console.log(pcmInfo);

            const pcm: IPcm = await pcmManager.createPcm(fileName, pcmManager.getDefaultPcmFormat(), pcmInfo, pcmSamples);
            this.result = pcm.id;
            this.done = true;
            this.parent.reportSessionFinished(this);
        })
    }


    cancel(): void {

    }

    getError(): Error | null {
        return this.error;
    }

    getProgress(): number {
        return this.audioConversionSession.getProgress();
    }

    isDone(): boolean {
        return this.done;
    }

    getResult(): PcmId | null {
        return this.result;
    }

    private parent: AudioImporter;
    private done: boolean = false;
    private error: Error | null = null;
    private result: PcmId | null = null;
    private dependencyManager: IDependencyManager;
    private audioConversionSession: IAudioConversionSession;

    private async extractPcmInfoFromAudioBlob(
        data: Uint8Array,
        fileName: string
    ): Promise<IPcmInfo> {
        return this.dependencyManager.getAudioProbe().probeAudio(fileName, data);
    }
}
