import type {AudioImportingSessionId} from "#shared/AudioImporting/IAudioImportingSession";

export class AudioImportingProgress {
    id: AudioImportingSessionId;
    fileName: string;
    progress: number;
    isDone: boolean;
    hasError: boolean;

    constructor(id: AudioImportingSessionId, fileName: string, progress: number, isDone: boolean, hasError: boolean) {
        this.id = id;
        this.fileName = fileName;
        this.progress = progress;
        this.isDone = isDone;
        this.hasError = hasError;
    }

}