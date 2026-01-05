/**
 * PCM format
 */
export interface IPcmFormat {

    /** Sample rate in Hz (e.g., 48000) */
    sampleRate: number;

    /** Number of channels (1=mono, 2=stereo) */
    channels: number;
}
