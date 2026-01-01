
/**
 * Describes a playback range inside an audio sample.
 */
export interface IPlaybackRange {
    /** Inclusive start offset, in milliseconds */
    startMs: number

    /** Exclusive end offset, in milliseconds */
    endMs: number
}

/**
 * Creates IPlaybackRange with safety checks.
 */
export function createPlaybackRange(
    startMs: number,
    endMs: number
): IPlaybackRange {
    if (startMs < 0) {
        throw new Error('startMs must be >= 0')
    }
    if (endMs <= startMs) {
        throw new Error('endMs must be > startMs')
    }

    return { startMs, endMs }
}
