import type {AudioImportingSessionId, IAudioImportingSession} from "#shared/AudioImporting/IAudioImportingSession";

export interface IAudioImporter {
    getMaximumAudioSize(): number;
    getAllowedMimes(): Set<string>;

    createAudioUploadingSession(fileName: string, mimeType: string, data: Uint8Array): IAudioImportingSession;
    getAudioUploadingSessionById(id: AudioImportingSessionId): IAudioImportingSession | null;
}
