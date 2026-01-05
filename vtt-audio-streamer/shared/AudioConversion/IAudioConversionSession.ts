export type AudioConversionSessionId = string & { readonly __brand: "AudioConversionSessionId" };

export interface IAudioConversionSession {
    readonly id: AudioConversionSessionId;

    cancel(): void;

    getProgress(): number;
    isDone(): boolean;
    getError(): Error | null;
    getResult(): Float32Array | null;
}