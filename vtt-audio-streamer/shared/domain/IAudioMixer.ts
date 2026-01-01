import type {IAudioTrack} from "#shared/domain/IAudioTrack";
import type {ITransition} from "#shared/domain/ITransition";
import type {IFade} from "#shared/domain/IFade";
import type {IAudioFrame} from "#shared/domain/IAudioFrame";

/**
 * Container for audio tracks
 */
export interface IAudioMixer{
    /**
     * Start the mixer.
     */
    start(): Promise<void>

    /**
     * Stop the mixer.
     */
    stop(): Promise<void>

    fadeIn(tracks: IAudioTrack[], fade: IFade): void
    fadeOut(tracks: IAudioTrack[], fade: IFade): void
    fadeInOut(fromTracks: IAudioTrack[], toTracks: IAudioTrack[], transition: ITransition): void

    onAudioFrame(callback: (frame: IAudioFrame) => void): void
}