import type {IAudioSample} from "#shared/IAudioSample";
import type {AudioTrackType} from "#shared/AudioTrackType";
import type {Volume} from "#shared/Volume";

/**
 * Playable and configurable audio track. Scenes consist of these.
 */
export interface IAudioTrack {
    audioSample: IAudioSample;
    audioTrackType: AudioTrackType;
    volume: Volume;
}