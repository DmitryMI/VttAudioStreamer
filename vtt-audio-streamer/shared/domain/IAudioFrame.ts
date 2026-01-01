/**
 * Represents a chunk of audio from the mixer.
 * Abstract type — could be PCM, Opus, or something else.
 */
export interface IAudioFrame {
    data: ArrayBuffer
    sampleRate: number
    channels: number
}