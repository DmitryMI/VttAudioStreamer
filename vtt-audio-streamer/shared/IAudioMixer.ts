import type {IAudioTrack} from "#shared/IAudioTrack";
import type {ITransition} from "#shared/ITransition";
import type {IFade} from "#shared/IFade";
import type {IPcm} from "#shared/Pcm/IPcm";

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

    onAudioFrame(callback: (frame: IPcm) => void): void
}