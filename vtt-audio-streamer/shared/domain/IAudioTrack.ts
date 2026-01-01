import type {IAudioSample} from "#shared/domain/IAudioSample";
import type {AudioTrackType} from "#shared/domain/AudioTrackType";
import type {Volume} from "#shared/domain/Volume";

/**
 * Playable and configurable audio track. Scenes consist of these.
 */
export interface IAudioTrack {
    audioSample: IAudioSample;
    audioTrackType: AudioTrackType;
    volume: Volume;
}