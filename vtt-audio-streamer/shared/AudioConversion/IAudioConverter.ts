import type {IPcmFormat} from "#shared/Pcm/IPcmFormat";
import type {AudioConversionSessionId, IAudioConversionSession} from "#shared/AudioConversion/IAudioConversionSession";

/**
 * Permanently stores uploaded files
 */
export interface IAudioConverter {

    createPcmConversionSession(data: Uint8Array, sourceMimeType: string, targetPcmInfo: IPcmFormat, completionCallback: (session: IAudioConversionSession)=>void): IAudioConversionSession;

    getAudioConversionSessionById(id: AudioConversionSessionId): IAudioConversionSession | null;
}