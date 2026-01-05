import type {IPcmInfo} from "#shared/Pcm/IPcmInfo";
import type {AudioConversionSessionId, IAudioConversionSession} from "#shared/AudioConversion/IAudioConversionSession";

/**
 * Permanently stores uploaded files
 */
export interface IAudioConverter {

    createPcmConversionSession(data: Uint8Array, sourceMimeType: string, targetPcmInfo: IPcmInfo, completionCallback: (session: IAudioConversionSession)=>void): IAudioConversionSession;

    getSessionById(id: AudioConversionSessionId): IAudioConversionSession | null;
}