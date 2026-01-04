import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";

export type PcmId = string & { readonly __brand: "PcmId" };

/**
 * Represents the whole imported audio track or a piece of it.
 */
export interface IPcm {
    /**
     * Track ID. Shared between all PCM fragments of the same file.
     */
    id: PcmId;
    name: string;
    pcmInfo: IPcmInfo;

    /**
     * Start timestamp (in ms) of this particular PCM fragment.
     */
    startMs: number;

    durationMs: number;

    /**
     * Returns IPcm instance representing the whole track.
     */
    getFullTrack(): IPcm;

    /**
     * Return IPcm instance representing a sub-fragment of this PCM fragment.
     * @param startOffsetMs - sub-fragment start offset in ms
     * @param durationMs - sub-fragment duration in ms
     */
    getFragment(startOffsetMs: number, durationMs: number): IPcm;

    /**
     * Returns PCM samples as array of Float32.
     */
    getSamples(): Float32Array;

    setFullTrackSamples(pcmSamples: Float32Array): void;
}
