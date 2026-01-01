import type { IPlaybackRange } from './IPlaybackRange'

/**
 * Imported and trimmed audio file.
 */
export interface IAudioSample {
    name: string;
    range: IPlaybackRange
}