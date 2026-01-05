import type {PcmId} from "#shared/Pcm/IPcm";

export type AudioImportingSessionId = string & { readonly __brand: "AudioImportingSessionId" };

export interface IAudioImportingSession {
    readonly id: AudioImportingSessionId;
    readonly fileName: string;

    cancel(): void;
    getProgress(): number;
    isDone(): boolean;
    getError(): Error | null;
    getResult(): PcmId | null;
}