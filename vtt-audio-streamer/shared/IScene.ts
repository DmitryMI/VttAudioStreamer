import type {IAudioTrack} from "#shared/IAudioTrack";
import type {Volume} from "#shared/Volume";

/**
 * Container for audio tracks
 */
export interface IScene{
    audioTracks: IAudioTrack[];
    volume: Volume;
    parent: IScene;
}