import type {IAudioTrack} from "#shared/domain/IAudioTrack";
import type {Volume} from "#shared/domain/Volume";

/**
 * Container for audio tracks
 */
export interface IScene{
    audioTracks: IAudioTrack[];
    volume: Volume;
    parent: IScene;
}